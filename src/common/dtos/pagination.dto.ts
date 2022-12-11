import { CoreOutput } from 'src/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field((type) => Int, { defaultValue: 1 })
  @IsInt()
  page: number;
}

@ObjectType()
export class PaginationOutput extends CoreOutput {
  @Field((type) => Int, { nullable: true })
  @IsInt()
  totalPages?: number;

  @Field((type) => Int, { nullable: true })
  @IsInt()
  totalResults?: number;
}
