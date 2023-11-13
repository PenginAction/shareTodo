import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FriendService } from './friend.service';
import { FriendRequest as FriendRequestModel } from './models/friendRequest.models';
import { SendFriendRequestInput } from './dto/sendFriendRequest.input';
import { FriendRequest, User } from '@prisma/client';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { RespondToFriendRequestInput } from './dto/respondToFriendRequest.input';

@Resolver()
export class FriendResolver {
  constructor(private readonly friendService: FriendService) {}

  @Query(() => [FriendRequestModel])
  @UseGuards(JwtAuthGuard)
  async getFriendRequests(
    @Args('userId', { type: () => Int }) userId: number,
    @Context() context,
  ): Promise<FriendRequest[]> {
    const user: User = context.req.user;
    if (userId !== user.id) {
      throw new UnauthorizedException(
        'Cannot gain get friend request(PENDING) on behalf of another user.',
      );
    }
    return this.friendService.getFriendRequests(userId);
  }

  @Mutation(() => FriendRequestModel)
  @UseGuards(JwtAuthGuard)
  async sendFriendRequest(
    @Args('sendFriendRequest') sendFriendRequest: SendFriendRequestInput,
    @Context() context,
  ): Promise<FriendRequest> {
    const user: User = context.req.user;
    if (sendFriendRequest.fromId !== user.id) {
      throw new UnauthorizedException(
        'Cannot send friend request on behalf of another user.',
      );
    }
    return await this.friendService.sendFriendRequest(sendFriendRequest);
  }

  @Mutation(() => FriendRequestModel)
  @UseGuards(JwtAuthGuard)
  async respondToFriendRequest(
    @Args('respondToFriendRequestInput')
    respondToFriendRequestInput: RespondToFriendRequestInput,
    @Context() context,
  ): Promise<FriendRequest> {
    const user: User = context.req.user;
    if (respondToFriendRequestInput.toId !== user.id) {
      throw new UnauthorizedException(
        'Cannot respond friend request on behalf of another user.',
      );
    }
    return await this.friendService.respondToFriendRequest(
      respondToFriendRequestInput,
    );
  }
}
