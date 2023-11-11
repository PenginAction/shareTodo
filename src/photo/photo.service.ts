import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { Photo } from '@prisma/client';
import * as path from 'path';
import { FileUpload } from './models/fileUpload.model';
import { Storage } from '@google-cloud/storage';
import * as process from 'process';

@Injectable()
export class PhotoService {
  private storage: Storage;
  private bucketName = process.env.GCLOUD_STORAGE_BUCKET;
  constructor(private readonly prismaService: PrismaService) {
    this.storage = new Storage({ keyFilename: 'storage.json' });
  }

  async uploadPhotos(files: FileUpload[], albumId: number): Promise<Photo[]> {
    const uploadPromises = files.map(async (filePromise) => {
      const file = await filePromise;
      const { createReadStream, filename } = file;
      const gcFileName = `${filename}`;
      const stream = createReadStream();

      await new Promise((resolve, reject) => {
        const blob = this.storage.bucket(this.bucketName).file(gcFileName);
        const blobStream = blob.createWriteStream();
        blobStream.on('finish', resolve);
        blobStream.on('error', reject);
        stream.pipe(blobStream);
      });

      const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${gcFileName}`;

      return this.prismaService.photo.create({
        data: {
          filePath: publicUrl,
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
        const gcFilePath = photo.filePath.replace(
          `https://storage.googleapis.com/${this.bucketName}/`,
          '',
        );
        const localFilePath = path.join(downloadDir, path.basename(gcFilePath));
        await new Promise((resolve, reject) => {
          const blob = this.storage.bucket(this.bucketName).file(gcFilePath);
          const blobStream = blob.createReadStream();
          const fileStream = fs.createWriteStream(localFilePath);

          blobStream.on('error', reject);
          blobStream.on('end', resolve);
          blobStream.pipe(fileStream);
        });
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
