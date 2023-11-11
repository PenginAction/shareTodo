import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AlbumService } from './album.service';
import { Album as AlbumModel } from './models/album.model';
import { CreateAlbumInput } from './dto/createAlbum.input';
import { Album } from '@prisma/client';
import { UpdateAlbumInput } from './dto/updateAlbum.input';
import {UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/guards/jwtAuth.guard";

@Resolver()
export class AlbumResolver {
  constructor(private readonly albumService: AlbumService) {}

  @Query(() => [AlbumModel], { nullable: 'items' })
  async getAlbums(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<Album[]> {
    return await this.albumService.getAlbums(userId);
  }

  @Mutation(() => AlbumModel)
  @UseGuards(JwtAuthGuard)
  async createAlbum(
    @Args('createAlbumInput') createAlbumInput: CreateAlbumInput,
  ): Promise<Album> {
    return await this.albumService.createAlbum(createAlbumInput);
  }

  @Mutation(() => AlbumModel)
  @UseGuards(JwtAuthGuard)
  async updateAlbum(
    @Args('updateAlbumInput') updateAlbumInput: UpdateAlbumInput,
  ): Promise<Album> {
    return await this.albumService.updateAlbum(updateAlbumInput);
  }

  @Mutation(() => AlbumModel)
  @UseGuards(JwtAuthGuard)
  async deleteAlbum(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Album> {
    return await this.albumService.deleteAlbum(id);
  }
}
