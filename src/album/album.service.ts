import { Injectable } from '@nestjs/common';
import { CreateAlbumInput } from './dto/createAlbum.input';
import { PrismaService } from '../prisma/prisma.service';
import { Album } from '@prisma/client';
import { UpdateAlbumInput } from './dto/updateAlbum.input';

@Injectable()
export class AlbumService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAlbums(userId: number): Promise<Album[]> {
    return await this.prismaService.album.findMany({
      where: { userId },
    });
  }

  async createAlbum(createAlbumInput: CreateAlbumInput): Promise<Album> {
    const { title, description, userId } = createAlbumInput;
    return await this.prismaService.album.create({
      data: {
        title,
        description,
        userId,
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

  async deleteAlbum(id: number): Promise<Album> {
    return await this.prismaService.album.delete({
      where: {
        id,
      },
    });
  }
}
