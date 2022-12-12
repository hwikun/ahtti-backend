import { User } from './../../user/entities/user.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Post } from './post.entity';

@InputType('CommentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Comment extends CoreEntity {
  @ManyToOne((type) => User, (user) => user.comments, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @Field((type) => User)
  author: User;

  @RelationId((comment: Comment) => comment.author)
  authorId: number;

  @Field((type) => String)
  @Column()
  text: string;

  @ManyToOne((type) => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @Field((type) => Post)
  post: Post;

  @RelationId((comment: Comment) => comment.post)
  postId: number;
}
