import { CoreOutput } from 'src/common/dtos/output.dto';
import { InputType, ObjectType } from '@nestjs/graphql';
import { GetCommentInput } from './get-comment.dto';

@InputType()
export class DeleteCommentInput extends GetCommentInput {}

@ObjectType()
export class DeleteCommentOutput extends CoreOutput {}
