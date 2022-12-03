import { CoreOutput } from './../../common/dtos/output.dto';
import { User } from './../entities/user.entity';
import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateProfileInput extends PartialType(
  PickType(User, ['email', 'username']),
) {
  @Field((type) => String)
  @IsString()
  password: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  updatePassword?: string;
}

@ObjectType()
export class UpdateProfileOutput extends CoreOutput {}
