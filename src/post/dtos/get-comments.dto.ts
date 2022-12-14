import { CoreOutput } from 'src/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Comment } from '../entities/comment.entity';

@ObjectType()
export class GetAllCommentsOutput extends CoreOutput {
  @Field((type) => [Comment], { nullable: true })
  comments?: Comment[];
}

@InputType()
export class GetAllCommentsInput {
  @Field((type) => Int)
  postId: number;
}
