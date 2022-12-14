import { User } from './../../user/entities/user.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, RelationId, OneToMany } from 'typeorm';
import { IsNumber, IsString } from 'class-validator';
import { Comment } from './comment.entity';

@InputType('PostInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Post extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  title: string;

  @Column()
  @Field((type) => String)
  content: string;

  @ManyToOne((type) => User, (user) => user.posts, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @Field((type) => User)
  author: User;

  @RelationId((post: Post) => post.author)
  authorId: number;

  @Column({ default: 0 })
  @Field((type) => Int)
  @IsNumber()
  viewCount: number;

  @OneToMany((type) => Comment, (comment) => comment.post, {
    nullable: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @Field((type) => [Comment], { nullable: true })
  comments?: Comment[];

  // TODO: Body or Content @Column({ type: 'json' })
}
