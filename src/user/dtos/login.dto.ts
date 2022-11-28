/* eslint-disable @typescript-eslint/no-unused-vars */
import { CoreOutput } from './../../common/dtos/output.dto';
import { User } from './../entities/user.entity';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class LoginInput extends PickType(User, ['password', 'email']) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field((type) => String, { nullable: true })
  @IsString()
  token?: string;
}
