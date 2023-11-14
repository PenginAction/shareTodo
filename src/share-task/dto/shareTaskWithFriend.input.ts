import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ShareTaskWithFriendInput {
  @Field(() => Int)
  taskId: number;

  @Field(() => Int)
  friendId: number;
}
