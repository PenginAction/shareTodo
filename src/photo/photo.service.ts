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

  async deletePhotos(photoIds: number[]): Promise<Photo[]> {
    return await Promise.all(
      photoIds.map((photoId) =>
        this.prismaService.photo.delete({
          where: { photoId },
        }),
      ),
    );
  }
}
