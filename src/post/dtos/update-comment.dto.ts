import { CoreOutput } from 'src/common/dtos/output.dto';
import { InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class UpdateCommentInput {}

@ObjectType()
export class UpdateCommentOutput extends CoreOutput {}
