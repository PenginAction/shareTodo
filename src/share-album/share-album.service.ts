import { SharedAlbum } from '@prisma/client';
import { ShareAlbumWithFriendInput } from './dto/shareAlbumWithFriend.input';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UnshareTaskInput } from '../share-task/dto/unshareTaskInput';
import { UnshareAlbumInput } from './dto/unshareAlbumInput';

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

  async unshareAlbum(
    userId: number,
    unshareAlbumInput: UnshareAlbumInput,
  ): Promise<boolean> {
    const { albumId, friendId } = unshareAlbumInput;

    const sharedAlbum = await this.prismaService.sharedAlbum.findFirst({
      where: {
        albumId: albumId,
        userId: friendId,
      },
    });

    if (!sharedAlbum) {
      throw new NotFoundException('Shared album not found');
    }

    const album = await this.prismaService.album.findUnique({
      where: { id: albumId },
    });

    if (!album || album.userId !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to unshare this album',
      );
    }

    await this.prismaService.sharedAlbum.delete({
      where: { id: sharedAlbum.id },
    });

    return true;
  }
}
