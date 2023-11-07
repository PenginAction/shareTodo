import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Album {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  // @Field()
  // created_at: Date;
  //
  // @Field()
  // updated_at: Date;
}
