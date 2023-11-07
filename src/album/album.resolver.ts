import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AlbumService } from './album.service';
import { Album as AlbumModel } from './models/album.model';
import { CreateAlbumInput } from './dto/createAlbum.input';
import { Album } from '@prisma/client';
import { UpdateAlbumInput } from './dto/updateAlbum.input';

@Resolver()
export class AlbumResolver {
  constructor(private readonly albumService: AlbumService) {}

  @Query(() => [AlbumModel], { nullable: 'items' })
  async getAlbums(): Promise<Album[]> {
    return await this.albumService.getAlbums();
  }

  @Mutation(() => AlbumModel)
  async createAlbum(
    @Args('createAlbumInput') createAlbumInput: CreateAlbumInput,
  ): Promise<Album> {
    return await this.albumService.createAlbum(createAlbumInput);
  }

  @Mutation(() => AlbumModel)
  async updateAlbum(
    @Args('updateAlbumInput') updateAlbumInput: UpdateAlbumInput,
  ): Promise<Album> {
    return await this.albumService.updateAlbum(updateAlbumInput);
  }
}
