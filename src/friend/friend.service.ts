import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendFriendRequestInput } from './dto/sendFriendRequest.input';
import { FriendRequest } from '@prisma/client';
import { RespondToFriendRequestInput } from './dto/respondToFriendRequest.input';

@Injectable()
export class FriendService {
  constructor(private readonly prismaService: PrismaService) {}

  async getFriendRequests(userId: number): Promise<FriendRequest[]> {
    return await this.prismaService.friendRequest.findMany({
      where: {
        toId: userId,
        status: 'PENDING',
      },
    });
  }

  async getFriendStatusList(userId: number): Promise<FriendRequest[]> {
    return await this.prismaService.friendRequest.findMany({
      where: {
        toId: userId,
        status: 'ACCEPTED',
      },
    });
  }

  async sendFriendRequest(
    sendFriendRequestInput: SendFriendRequestInput,
  ): Promise<FriendRequest> {
    const { fromId, toId } = sendFriendRequestInput;
    const existingRequest = await this.prismaService.friendRequest.findFirst({
      where: {
        fromId,
        toId,
        status: {
          not: 'REJECTED',
        },
      },
    });

    if (existingRequest) {
      throw new Error('A peding or accepted friend request already exists');
    }

    return await this.prismaService.friendRequest.create({
      data: {
        fromId,
        toId,
      },
      include: {
        from: true,
        to: true,
      },
    });
  }

  async respondToFriendRequest(
    respondTpFriendRequestInput: RespondToFriendRequestInput,
  ): Promise<FriendRequest> {
    const { requestId, toId, status } = respondTpFriendRequestInput;
    const request = await this.prismaService.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.toId != toId) {
      throw new Error('Invalid request or permission denied');
    }

    if (request.status !== 'PENDING') {
      throw new Error('Cannot modify a non-pending friend request');
    }

    return await this.prismaService.friendRequest.update({
      where: { id: requestId },
      data: { status },
      include: {
        from: true,
        to: true,
      },
    });
  }

  async deleteFriendRequest(
    userId: number,
    requestId: number,
  ): Promise<boolean> {
    const request = await this.prismaService.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.toId !== userId) {
      throw new Error('Request not found or permission denied');
    }

    await this.prismaService.friendRequest.delete({
      where: { id: requestId },
    });

    return true;
  }
}
