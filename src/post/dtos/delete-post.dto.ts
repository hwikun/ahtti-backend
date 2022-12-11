import { CoreOutput } from './../../common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class DeletePostInput {
  @Field((type) => Int)
  postId: number;
}

@ObjectType()
export class DeletePostOutput extends CoreOutput {}
