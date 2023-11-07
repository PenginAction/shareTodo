import { Injectable } from '@nestjs/common';
import { CreateAlbumInput } from './dto/createAlbum.input';
import { PrismaService } from '../prisma/prisma.service';
import { Album } from '@prisma/client';

@Injectable()
export class AlbumService {
  constructor(private readonly prismaService: PrismaService) {}
  async getAlbums(): Promise<Album[]> {
    return await this.prismaService.album.findMany();
  }

  async createAlbum(createAlbumInput: CreateAlbumInput): Promise<Album> {
    const { title, description } = createAlbumInput;
    return await this.prismaService.album.create({
      data: {
        title,
        description,
      },
    });
  }
}
