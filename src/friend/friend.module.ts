import { Module } from '@nestjs/common';
import { FriendResolver } from './friend.resolver';
import { FriendService } from './friend.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FriendResolver, FriendService],
})
export class FriendModule {}
