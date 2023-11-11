import { IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GoogleSignInInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  token: string; // Google認証トークン
}
