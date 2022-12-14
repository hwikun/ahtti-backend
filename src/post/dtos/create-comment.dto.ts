import { CoreOutput } from './../../common/dtos/output.dto';
import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { Comment } from '../entities/comment.entity';

@InputType()
export class CreateCommentInput extends PickType(Comment, ['text']) {
  @Field((type) => Int)
  @IsInt()
  postId: number;
}

@ObjectType()
export class CreateCommentOutput extends CoreOutput {}
