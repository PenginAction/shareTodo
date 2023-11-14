import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ShareAlbum {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  albumId: number;

  @Field(() => Int)
  userId: number;
}
