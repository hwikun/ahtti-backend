import { CoreEntity } from './../../common/entities/core.entity';
import { IsInt, IsString } from 'class-validator';
import { Field, InputType, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Post } from './post.entity';

@InputType('AuthorInputType', { isAbstract: true })
@ObjectType()
class Author {
  @Field((type) => Int)
  @IsInt()
  id: number;

  @Field((type) => String)
  @IsString()
  username: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  profileImg?: string;
}
@InputType('CommentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Comment extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  text: string;

  @Field((type) => Author)
  @Column({ type: 'json' })
  author: Author;

  @Field((type) => Post)
  @ManyToOne((type) => Post, (post) => post.comments)
  post: Post;

  @RelationId((comment: Comment) => comment.post)
  postId: number;
}
