import { Post } from './../entities/post.entity';
import { CoreOutput } from './../../common/dtos/output.dto';
import { Field, ObjectType, ArgsType, Int } from '@nestjs/graphql';

@ArgsType()
export class GetPostInput {
  @Field((type) => Int)
  postId: number;
}
@ObjectType()
export class GetPostOutput extends CoreOutput {
  @Field((type) => Post, { nullable: true })
  post?: Post;
}
