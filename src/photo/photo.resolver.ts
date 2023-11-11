import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { PhotoService } from './photo.service';
import { Photo as PhotoModel } from './models/photo.model';
import { Photo } from '@prisma/client';
import { FileUpload } from './models/fileUpload.model';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import {UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/guards/jwtAuth.guard";

@Resolver()
export class PhotoResolver {
  constructor(private readonly photoService: PhotoService) {}

  @Mutation(() => [PhotoModel])
  @UseGuards(JwtAuthGuard)
  async uploadPhotos(
    @Args('files', { type: () => [GraphQLUpload] }) files: FileUpload[],
    @Args('albumId', { type: () => Int }) albumId: number,
  ): Promise<Photo[]> {
    return await this.photoService.uploadPhotos(files, albumId);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async downloadPhotos(
    @Args('albumId', { type: () => Int }) albumId: number,
  ): Promise<boolean> {
    try {
      await this.photoService.downloadPhotos(albumId);
      return true;
    } catch (error) {
      return false;
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deletePhotos(
    @Args('photoIds', { type: () => [Int] }) photoIds: number[],
    @Args('albumId', { type: () => Int }) albumId: number,
  ): Promise<boolean> {
    try {
      await this.photoService.deletePhotos(photoIds, albumId);
      return true;
    } catch (error) {
      return false;
    }
  }
}
