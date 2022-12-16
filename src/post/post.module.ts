import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver, CommentResolver, NoticeResolver } from './post.resolver';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Comment])],
  providers: [PostService, PostResolver, CommentResolver, NoticeResolver],
})
export class PostModule {}
