import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FriendRequestStatus } from '@prisma/client';
import { User } from '../../user/models/user.model';

@ObjectType()
export class FriendRequest {
  @Field(() => Int)
  id: number;

  @Field()
  from: User;

  @Field(() => Int)
  fromId: number;

  @Field()
  to: User;

  @Field(() => Int)
  toId: number;

  @Field()
  status: FriendRequestStatus;
}
