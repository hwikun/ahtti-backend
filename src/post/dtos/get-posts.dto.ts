import { Post } from './../entities/post.entity';
import { CoreOutput } from './../../common/dtos/output.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetPostsOutput extends CoreOutput {
  @Field((type) => [Post], { nullable: true })
  posts?: Post[];
}
