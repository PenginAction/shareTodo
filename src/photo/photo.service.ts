import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { Photo } from '@prisma/client';
import * as path from 'path';
import { FileUpload } from './models/fileUpload.model';

@Injectable()
export class PhotoService {
  constructor(private readonly prismaService: PrismaService) {}

  async uploadPhotos(files: FileUpload[], albumId: number): Promise<Photo[]> {
    const uploadDir = './uploads';

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const uploadPromises = files.map(async (filePromise) => {
      const file = await filePromise;
      const { createReadStream, filename } = file;
      const filePath = path.join(uploadDir, filename);
      const stream = createReadStream();

      await new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);
        writeStream.on('finish', resolve);
        writeStream.on('error', (error) => {
          fs.unlinkSync(filePath);
          reject(error);
        });
        stream.pipe(writeStream);
      });

      return this.prismaService.photo.create({
        data: {
          filePath,
          album: {
            connect: { id: albumId },
          },
        },
      });
    });

    return Promise.all(uploadPromises);
  }

  async downloadPhotos(albumId: number): Promise<void> {
    const downloadDir = './downloads';
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir);
    }
    const photos = await this.prismaService.photo.findMany({
      where: { albumId },
    });

    await Promise.all(
      photos.map(async (photo) => {
        const filePath = photo.filePath;
        const fileData = await fs.promises.readFile(filePath);
        const newFilePath = path.join(downloadDir, path.basename(filePath));
        await fs.promises.writeFile(newFilePath, fileData);
      }),
    );
  }

  async deletePhotos(photoIds: number[], albumId: number): Promise<void> {
    await Promise.all(
      photoIds.map(async (photoId) => {
        const photo = await this.prismaService.photo.findFirst({
          where: {
            photoId,
            albumId,
          },
        });

        if (!photo) {
          throw new Error('Photo not found in the specified album');
        }

        const filePath = photo.filePath;

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        await this.prismaService.photo.delete({
          where: { photoId },
        });
      }),
    );
  }
}
