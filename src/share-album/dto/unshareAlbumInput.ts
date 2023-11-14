import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UnshareAlbumInput {
  @Field(() => Int)
  albumId: number;

  @Field(() => Int)
  friendId: number;
}
