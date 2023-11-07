import { Module } from '@nestjs/common';
import { AlbumResolver } from './album.resolver';
import { AlbumService } from './album.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AlbumResolver, AlbumService],
})
export class AlbumModule {}
