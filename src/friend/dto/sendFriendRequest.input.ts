import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SendFriendRequestInput {
  @Field(() => Int)
  fromId: number;

  @Field(() => Int)
  toId: number;
}
