import { Query, Resolver } from '@nestjs/graphql';
import { AlbumService } from './album.service';
import { Album } from './models/album.model';

@Resolver()
export class AlbumResolver {
  constructor(private readonly albumService: AlbumService) {}

  @Query(() => [Album], { nullable: 'items' })
  getAlbums(): Album[] {
    return this.albumService.getAlbums();
  }
}
