import { Post } from './../entities/post.entity';
import {
  PaginationInput,
  PaginationOutput,
} from './../../common/dtos/pagination.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class SearchPostInput extends PaginationInput {
  @Field((type) => String)
  @IsString()
  query: string;
}

@ObjectType()
export class SearchPostOutput extends PaginationOutput {
  @Field((type) => [Post], { nullable: true })
  posts?: Post[];
}
