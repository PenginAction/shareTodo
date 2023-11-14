import { Module } from '@nestjs/common';
import { ShareTaskResolver } from './share-task.resolver';
import { ShareTaskService } from './share-task.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ShareTaskResolver, ShareTaskService],
})
export class ShareTaskModule {}
