import { SharedAlbum } from '@prisma/client';
import { ShareAlbumWithFriendInput } from './dto/shareAlbumWithFriend.input';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShareAlbumService {
  constructor(private readonly prismaService: PrismaService) {}

  async shareAlbumWithFriend(
    userId: number,
    shareAlbumWithFriendInput: ShareAlbumWithFriendInput,
  ): Promise<SharedAlbum> {
    const { albumId, friendId } = shareAlbumWithFriendInput;

    const album = await this.prismaService.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      throw new Error('Album not found');
    }

    if (album.userId !== userId) {
      throw new Error('User is not the owner of the album');
    }

    // Check if the album is already shared with the friend
    const existingShare = await this.prismaService.sharedAlbum.findFirst({
      where: {
        albumId: albumId,
        userId: friendId,
      },
    });

    if (existingShare) {
      throw new Error('Album is already shared with this user');
    }

    // If not already shared, create the share
    return await this.prismaService.sharedAlbum.create({
      data: {
        albumId: albumId,
        userId: friendId,
      },
    });
  }
}
