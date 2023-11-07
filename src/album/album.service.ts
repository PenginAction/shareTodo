import { Injectable } from '@nestjs/common';
import { CreateAlbumInput } from './dto/createAlbum.input';
import { PrismaService } from '../prisma/prisma.service';
import { Album } from '@prisma/client';
import { UpdateAlbumInput } from './dto/updateAlbum.input';

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

  async updateAlbum(updateAlbumInput: UpdateAlbumInput): Promise<Album> {
    const { id, title, description } = updateAlbumInput;
    return await this.prismaService.album.update({
      data: { title, description },
      where: { id },
    });
  }
}
