import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { SharedTask, User } from '@prisma/client';
import { ShareTaskService } from './share-task.service';
import { ShareTask } from './models/shareTask.model';
import { ShareTaskWithFriendInput } from './dto/shareTaskWithFriend.input';
import { UnshareTaskInput } from './dto/unshareTaskInput';

@Resolver()
export class ShareTaskResolver {
  constructor(private readonly shareTaskService: ShareTaskService) {}

  @Mutation(() => ShareTask)
  @UseGuards(JwtAuthGuard)
  async shareTaskWithFriend(
    @Args('shareTaskWithFriendInput')
    sharetaskWithInput: ShareTaskWithFriendInput,
    @Context() context,
  ): Promise<SharedTask> {
    const user: User = context.req.user;

    return await this.shareTaskService.shareTaskWithFriend(
      user.id,
      sharetaskWithInput,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async unshareTask(
    @Args('unshareTaskInput')
    unshareTaskInput: UnshareTaskInput,
    @Context() context,
  ): Promise<boolean> {
    const user: User = context.req.user;

    return await this.shareTaskService.unshareTask(user.id, unshareTaskInput);
  }
}
