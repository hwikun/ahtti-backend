import { CoreOutput } from './../../common/dtos/output.dto';
import { User } from './../entities/user.entity';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class LoginInput extends PickType(User, ['username', 'password']) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field((type) => String, { nullable: true })
  @IsString()
  token?: string;
}
