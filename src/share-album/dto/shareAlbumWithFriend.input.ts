import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ShareAlbumWithFriendInput {
  @Field(() => Int)
  albumId: number;

  @Field(() => Int)
  friendId: number;
}
