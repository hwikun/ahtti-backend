import { User } from './../../user/entities/user.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { IsNumber, IsString } from 'class-validator';
import { Comment } from './comment.entity';

@InputType('PostInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Post extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  title: string;

  @Field((type) => String)
  @Column()
  content: string;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.posts, { onDelete: 'CASCADE' })
  author: User;

  @RelationId((post: Post) => post.author)
  authorId: number;

  @Field((type) => Int)
  @Column({ default: 0 })
  @IsNumber()
  viewCount: number;

  @Field((type) => [Comment], { nullable: true })
  @ManyToOne((type) => Comment, (comment) => comment.text, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  comments?: Comment[];

  // TODO: Body or Content @Column({ type: 'json' })
}
