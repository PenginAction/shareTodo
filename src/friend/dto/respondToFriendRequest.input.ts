import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { FriendRequestStatus } from '@prisma/client';

@InputType()
export class RespondToFriendRequestInput {
  @Field(() => Int)
  requestId: number;

  @Field(() => Int)
  toId: number;

  @Field()
  @IsEnum(FriendRequestStatus)
  status: FriendRequestStatus;
}
