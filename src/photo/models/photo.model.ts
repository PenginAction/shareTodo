import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Photo {
  @Field(() => Int)
  photoId: number;

  @Field()
  filePath: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Int)
  albumId: number;
}
