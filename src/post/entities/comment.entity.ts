import { User } from './../../user/entities/user.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Post } from './post.entity';

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

  @Field((type) => Post)
  @ManyToOne((type) => Post, (post) => post.comments)
  post: Post;
}
