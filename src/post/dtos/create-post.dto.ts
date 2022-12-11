import { CoreOutput } from './../../common/dtos/output.dto';
import { Post } from './../entities/post.entity';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';

@InputType()
export class CreatePostInput extends PickType(Post, ['title', 'content']) {}

@ObjectType()
export class CreatePostOutput extends CoreOutput {}
