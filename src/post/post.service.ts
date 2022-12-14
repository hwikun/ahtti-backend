import {
  CreateCommentInput,
  CreateCommentOutput,
} from './dtos/create-comment.dto';
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

import {
  UpdateCommentInput,
  UpdateCommentOutput,
} from './dtos/update-comment.dto';
import { Comment } from './entities/comment.entity';
import {
  GetAllCommentsInput,
  GetAllCommentsOutput,
} from './dtos/get-comments.dto';
import { GetCommentInput, GetCommentOutput } from './dtos/get-comment.dto';
import {
  DeleteCommentInput,
  DeleteCommentOutput,
} from './dtos/delete-comment.dto';

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
      });
      console.log(post);
      if (!post) {
        throw new Error('not found post');
      }
      await this.posts.update(postId, { viewCount: post.viewCount + 1 });
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
      await this.posts.update(postId, { title, content });
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
  async createComment(
    author: User,
    { postId, text }: CreateCommentInput,
  ): Promise<CreateCommentOutput> {
    try {
      const post = await this.posts.findOneBy({ id: postId });
      if (!post) {
        throw new Error('not found post');
      }
      const { id, username, profileImg } = author;
      await this.comments.save(
        await this.comments.create({
          post,
          text,
          author: {
            id,
            username,
            profileImg,
          },
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

  /** 댓글 전체 가져오기 */
  async getAllComments({
    postId,
  }: GetAllCommentsInput): Promise<GetAllCommentsOutput> {
    try {
      const comments = await this.comments.findBy({ post: { id: postId } });
      if (!comments) {
        throw new Error('This post has no comments');
      }
      return {
        ok: true,
        comments,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  /** 내가 쓴 댓글 가져오기 */
  async getComment({ commentId }: GetCommentInput): Promise<GetCommentOutput> {
    try {
      const comment = await this.comments.findOneBy({ id: commentId });
      if (!comment) {
        throw new Error('Not found comment');
      }
      return {
        ok: true,
        comment,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  /** 댓글 작성자 체크 함수 */
  async checkCommentAuthor(authorId: number, commentId: number) {
    try {
      const { ok, error, comment } = await this.getComment({ commentId });
      if (!ok) {
        throw new Error(error);
      }
      if (comment.author.id !== authorId) {
        throw new Error("You can't update the comment with you don't own");
      }
      return comment;
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  /** 댓글 업데이트 */
  async updateComment(
    author: User,
    { commentId, text }: UpdateCommentInput,
  ): Promise<UpdateCommentOutput> {
    try {
      await this.checkCommentAuthor(author.id, commentId);
      await this.comments.update(commentId, { text });
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

  /** 댓글 삭제 함수 */
  async deleteComment(
    author: User,
    { commentId }: DeleteCommentInput,
  ): Promise<DeleteCommentOutput> {
    try {
      await this.checkCommentAuthor(author.id, commentId);
      await this.comments.delete(commentId);
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
}
