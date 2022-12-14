import {
  DeleteCommentInput,
  DeleteCommentOutput,
} from './dtos/delete-comment.dto';
import { GetCommentInput, GetCommentOutput } from './dtos/get-comment.dto';
import {
  CreateCommentOutput,
  CreateCommentInput,
} from './dtos/create-comment.dto';
import { SearchPostInput, SearchPostOutput } from './dtos/search-post.dto';
import { DeletePostOutput, DeletePostInput } from './dtos/delete-post.dto';
import { GetPostInput, GetPostOutput } from './dtos/get-post.dto';
import { GetPostsOutput } from './dtos/get-posts.dto';
import { User } from './../user/entities/user.entity';
import { CreatePostOutput, CreatePostInput } from './dtos/create-post.dto';
import { PostService } from './post.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth.decorator';
import { Query } from '@nestjs/graphql';
import { UpdatePostInput, UpdatePostOutput } from './dtos/update-post.dto';
import {
  UpdateCommentInput,
  UpdateCommentOutput,
} from './dtos/update-comment.dto';
import {
  GetAllCommentsInput,
  GetAllCommentsOutput,
} from './dtos/get-comments.dto';
import { Role } from 'src/auth/role.decorator';

@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation((returns) => CreatePostOutput)
  @Role(['Any'])
  createPost(
    @AuthUser() author: User,
    @Args('input') createPostInput: CreatePostInput,
  ): Promise<CreatePostOutput> {
    return this.postService.createPost(author, createPostInput);
  }

  @Query((returns) => GetPostsOutput)
  getAllPosts(): Promise<GetPostsOutput> {
    return this.postService.getAllPosts();
  }

  @Query((returns) => GetPostOutput)
  @Role(['Any'])
  getPost(@Args() { postId }: GetPostInput): Promise<GetPostOutput> {
    return this.postService.getPost(postId);
  }

  @Mutation((returns) => DeletePostOutput)
  @Role(['Any'])
  deletePost(
    @AuthUser() author: User,
    @Args('input') deletePostInput: DeletePostInput,
  ): Promise<DeletePostOutput> {
    return this.postService.deletePost(author, deletePostInput);
  }

  @Mutation((returns) => UpdatePostOutput)
  @Role(['Any'])
  updatePost(
    @AuthUser() author: User,
    @Args('input') updatePostInput: UpdatePostInput,
  ): Promise<UpdatePostOutput> {
    return this.postService.updatePost(author, updatePostInput);
  }
  @Query((returns) => SearchPostOutput)
  searchPost(
    @Args('input') searchPostInput: SearchPostInput,
  ): Promise<SearchPostOutput> {
    return this.postService.searchPost(searchPostInput);
  }
}

@Resolver()
export class CommentResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation((returns) => CreateCommentOutput)
  @Role(['Any'])
  createComment(
    @AuthUser() author: User,
    @Args('input') createCommentInput: CreateCommentInput,
  ): Promise<CreateCommentOutput> {
    return this.postService.createComment(author, createCommentInput);
  }

  @Query((returns) => GetCommentOutput)
  @Role(['Any'])
  getComment(
    @Args('input') getCommentInput: GetCommentInput,
  ): Promise<GetCommentOutput> {
    return this.postService.getComment(getCommentInput);
  }

  @Query((returns) => GetAllCommentsOutput)
  @Role(['Any'])
  getAllComments(
    @Args('input') getCommentsInput: GetAllCommentsInput,
  ): Promise<GetAllCommentsOutput> {
    return this.postService.getAllComments(getCommentsInput);
  }

  @Mutation((returns) => UpdateCommentOutput)
  @Role(['Any'])
  updateComment(
    @AuthUser() author: User,
    @Args('input') updateCommentInput: UpdateCommentInput,
  ): Promise<UpdateCommentOutput> {
    return this.postService.updateComment(author, updateCommentInput);
  }

  @Mutation((returns) => DeleteCommentOutput)
  @Role(['Any'])
  deleteComment(
    @AuthUser() author: User,
    @Args('input') deleteCommentInput: DeleteCommentInput,
  ): Promise<DeleteCommentOutput> {
    return this.postService.deleteComment(author, deleteCommentInput);
  }
}
