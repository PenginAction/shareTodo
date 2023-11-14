import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ShareAlbumService } from './share-album.service';
import { ShareAlbum } from './models/shareAlbum.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { ShareAlbumWithFriendInput } from './dto/shareAlbumWithFriend.input';
import { SharedAlbum, User } from '@prisma/client';
import { UnshareAlbumInput } from './dto/unshareAlbumInput';

@Resolver()
export class ShareAlbumResolver {
  constructor(private readonly shareAlbumService: ShareAlbumService) {}

  @Mutation(() => ShareAlbum)
  @UseGuards(JwtAuthGuard)
  async shareAlbumWithFriend(
    @Args('shareAlbumWithFriendInput')
    shareAlbumWithInput: ShareAlbumWithFriendInput,
    @Context() context,
  ): Promise<SharedAlbum> {
    const user: User = context.req.user;

    return await this.shareAlbumService.shareAlbumWithFriend(
      user.id,
      shareAlbumWithInput,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async unshareAlbum(
    @Args('unshareAlbumInput')
    unshareAlbumInput: UnshareAlbumInput,
    @Context() context,
  ): Promise<boolean> {
    const user: User = context.req.user;

    return await this.shareAlbumService.unshareAlbum(
      user.id,
      unshareAlbumInput,
    );
  }
}
