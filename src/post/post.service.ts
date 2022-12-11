import { SearchPostOutput, SearchPostInput } from './dtos/search-post.dto';
import { UpdatePostInput, UpdatePostOutput } from './dtos/update-post.dto';
import { DeletePostInput, DeletePostOutput } from './dtos/delete-post.dto';
import { GetPostOutput } from './dtos/get-post.dto';
import { GetPostsOutput } from './dtos/get-posts.dto';
import { User } from './../user/entities/user.entity';
import { CreatePostInput, CreatePostOutput } from './dtos/create-post.dto';
import { Post } from './entities/post.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly posts: Repository<Post>,
    @InjectRepository(Comment) private readonly comments: Repository<Comment>,
  ) {}

  /** 포스트 작성 함수 */
  async createPost(
    author: User,
    { title, content }: CreatePostInput,
  ): Promise<CreatePostOutput> {
    try {
      await this.posts.save(
        await this.posts.create({
          title,
          content,
          author,
        }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  /** 모든 포스트 조회 */
  async getAllPosts(): Promise<GetPostsOutput> {
    try {
      const posts = await this.posts.find({
        relations: ['author', 'comments'],
      });
      if (!posts) {
        throw new Error('not found posts');
      }
      return {
        ok: true,
        posts,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  /** 포스트 조회 */
  async getPost(postId: number): Promise<GetPostOutput> {
    try {
      const post = await this.posts.findOne({
        where: { id: postId },
        relations: ['comments', 'author'],
      });
      if (!post) {
        throw new Error('not found post');
      }
      await this.posts.save({ id: postId, viewCount: post.viewCount + 1 });
      return {
        ok: true,
        post,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  /** 포스트 삭제 함수 */
  async deletePost(
    author: User,
    { postId }: DeletePostInput,
  ): Promise<DeletePostOutput> {
    try {
      const { ok, post } = await this.getPost(postId);
      if (!ok) {
        throw new Error('not found post');
      }
      if (post.authorId !== author.id) {
        throw new Error("You can't delete the post with you don't own");
      }
      await this.posts.delete(postId);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  /** 포스트 업데이트 함수 */
  async updatePost(
    author: User,
    { postId, title, content }: UpdatePostInput,
  ): Promise<UpdatePostOutput> {
    try {
      const { ok, error, post } = await this.getPost(postId);
      if (!ok) {
        throw new Error(error);
      }
      if (post.authorId !== author.id) {
        throw new Error("You can't update the post with you don't own");
      }
      if (title) {
        post.title = title;
      }
      if (content) {
        post.content = content;
      }
      await this.posts.save({ id: postId, title, content });
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  /** 포스트 검색 함수 */
  async searchPost({
    query,
    page,
  }: SearchPostInput): Promise<SearchPostOutput> {
    try {
      const [posts, totalResults] = await this.posts.findAndCount({
        where: { title: ILike(`%${query}%`) },
        skip: (page - 1) * 25,
        take: 25,
      });
      return {
        ok: true,
        posts,
        totalPages: Math.ceil(totalResults / 25),
        totalResults,
      };
    } catch (error) {
      return {
        ok: false,
        error: `Could not found ${query}`,
      };
    }
  }
  /** 댓글 작성 함수 */
}
