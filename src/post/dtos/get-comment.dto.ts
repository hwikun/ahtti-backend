import { CoreOutput } from 'src/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { Comment } from '../entities/comment.entity';

@InputType()
export class GetCommentInput {
  @Field((type) => Int)
  @IsInt()
  postId: number;

  @Field((type) => Int)
  @IsInt()
  commentId: number;
}

@ObjectType()
export class GetCommentOutput extends CoreOutput {
  @Field((type) => Comment, { nullable: true })
  comment?: Comment;
}
