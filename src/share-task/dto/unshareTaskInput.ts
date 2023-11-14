import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UnshareTaskInput {
  @Field(() => Int)
  taskId: number;

  @Field(() => Int)
  friendId: number;
}
