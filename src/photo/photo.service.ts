import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { Photo } from '@prisma/client';
import * as path from 'path';
import { FileUpload } from './models/fileUpload.model';

@Injectable()
export class PhotoService {
  constructor(private readonly prismaService: PrismaService) {}

  async uploadPhoto(file: FileUpload, albumId: number): Promise<Photo> {
    const { createReadStream, filename } = file;

    const uploadDir = './uploads';

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

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
  }
}
