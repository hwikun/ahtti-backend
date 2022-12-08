import { User } from './../../user/entities/user.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';

@InputType('CommentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Comment extends CoreEntity {
  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.comments)
  author: User;

  @RelationId((comment: Comment) => comment.author)
  authorId: number;

  @Field((type) => String)
  @Column()
  text: string;

  @Field((type) => Comment)
  @OneToMany((type) => Comment, (comment) => comment.children)
  parent: Comment;

  @Field((type) => [Comment])
  @ManyToOne((type) => Comment, (comment) => comment.parent)
  children?: Comment[];
}
