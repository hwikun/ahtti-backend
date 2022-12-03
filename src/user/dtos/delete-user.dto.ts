import { CoreOutput } from './../../common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class DeleteUserInput {
  @Field((type) => Int)
  @IsInt()
  userId: number;
}

@ObjectType()
export class DeleteUserOutput extends CoreOutput {}
