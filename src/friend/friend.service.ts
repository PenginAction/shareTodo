import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendFriendRequestInput } from './dto/sendFriendRequest.input';
import { FriendRequest } from '@prisma/client';

@Injectable()
export class FriendService {
  constructor(private readonly prismaService: PrismaService) {}

  async sendFriendRequest(
    sendFriendRequestInput: SendFriendRequestInput,
  ): Promise<FriendRequest> {
    const { fromId, toId } = sendFriendRequestInput;
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
}
