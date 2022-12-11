import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Post } from '../entities/post.entity';

@InputType()
export class UpdatePostInput extends PartialType(
  PickType(Post, ['title', 'content']),
) {
  @Field((type) => Int)
  @IsInt()
  postId: number;
}

@ObjectType()
export class UpdatePostOutput extends CoreOutput {}
