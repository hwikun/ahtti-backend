import { CoreOutput } from './../../common/dtos/output.dto';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from '../entities/user.entity';

@InputType()
export class CreateUserInput extends PickType(User, [
  'email',
  'password',
  'username',
]) {
  @Field((type) => String)
  @IsString()
  confirmPassword: string;
}

@ObjectType()
export class CreateUserOutput extends CoreOutput {}
