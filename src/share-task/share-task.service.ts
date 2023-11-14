import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SharedTask } from '@prisma/client';
import { ShareTaskWithFriendInput } from './dto/shareTaskWithFriend.input';
import { UnshareTaskInput } from './dto/unshareTaskInput';

@Injectable()
export class ShareTaskService {
  constructor(private readonly prismaService: PrismaService) {}

  async shareTaskWithFriend(
    userId: number,
    shareTaskWithFriendInput: ShareTaskWithFriendInput,
  ): Promise<SharedTask> {
    const { taskId, friendId } = shareTaskWithFriendInput;

    const task = await this.prismaService.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.userId !== userId) {
      throw new Error('User is not the owner of the task');
    }

    const existingShare = await this.prismaService.sharedTask.findFirst({
      where: {
        taskId: taskId,
        userId: friendId,
      },
    });

    if (existingShare) {
      throw new Error('Task is already shared with this user');
    }

    return await this.prismaService.sharedTask.create({
      data: {
        taskId: taskId,
        userId: friendId,
      },
    });
  }

  async unshareTask(
    userId: number,
    unshareTaskInput: UnshareTaskInput,
  ): Promise<boolean> {
    const { taskId, friendId } = unshareTaskInput;

    const sharedTask = await this.prismaService.sharedTask.findFirst({
      where: {
        taskId: taskId,
        userId: friendId,
      },
    });

    if (!sharedTask) {
      throw new NotFoundException('Shared task not found');
    }

    const task = await this.prismaService.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.userId !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to unshare this task',
      );
    }

    await this.prismaService.sharedTask.delete({
      where: { id: sharedTask.id },
    });

    return true;
  }
}
