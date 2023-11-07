import { Module } from '@nestjs/common';
import { AlbumResolver } from './album.resolver';
import { AlbumService } from './album.service';

@Module({
  providers: [AlbumResolver, AlbumService]
})
export class AlbumModule {}
