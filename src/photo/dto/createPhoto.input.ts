import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreatePhotoInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  filePath: string;

  @Field(() => Int)
  albumId: number;
}
