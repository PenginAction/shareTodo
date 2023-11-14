import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ShareTask {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  taskId: number;

  @Field(() => Int)
  userId: number;
}
