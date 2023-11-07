import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Album {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
