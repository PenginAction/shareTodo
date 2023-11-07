import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AlbumService } from './album.service';
import { Album } from './models/album.model';

@Resolver()
export class AlbumResolver {
  constructor(private readonly albumService: AlbumService) {}

  @Query(() => [Album], { nullable: 'items' })
  getAlbums(): Album[] {
    return this.albumService.getAlbums();
  }

  @Mutation(() => Album)
  createAlbum(
    @Args('title') title: string,
    @Args('description', { nullable: true }) description: string,
  ): Album {
    return this.albumService.createAlbum(title, description);
  }
}
