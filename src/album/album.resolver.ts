import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AlbumService } from './album.service';
import { Album } from './models/album.model';
import {CreateAlbumInput} from "./dto/createAlbum.input";

@Resolver()
export class AlbumResolver {
  constructor(private readonly albumService: AlbumService) {}

  @Query(() => [Album], { nullable: 'items' })
  getAlbums(): Album[] {
    return this.albumService.getAlbums();
  }

  @Mutation(() => Album)
  createAlbum(
    @Args('createAlbumInput') createAlbumInput: CreateAlbumInput,): Album {
    return this.albumService.createAlbum(createAlbumInput);
  }
}
