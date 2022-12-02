import { CoreOutput } from './../../common/dtos/output.dto';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class VerifyEmailInput extends PickType(User, ['email']) {}

@ObjectType()
export class VerifyEmailOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
