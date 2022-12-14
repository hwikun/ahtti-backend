import { CoreOutput } from 'src/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Comment } from '../entities/comment.entity';

@InputType()
export class UpdateCommentInput extends PickType(Comment, ['text']) {
  @Field((type) => Int)
  postId: number;

  @Field((type) => Int)
  commentId: number;
}

@ObjectType()
export class UpdateCommentOutput extends CoreOutput {}
