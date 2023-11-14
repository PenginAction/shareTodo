import { Module } from '@nestjs/common';
import { ShareAlbumResolver } from './share-album.resolver';
import { ShareAlbumService } from './share-album.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ShareAlbumResolver, ShareAlbumService],
})
export class ShareAlbumModule {}
