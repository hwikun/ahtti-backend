import { PostService } from './post.service';
import { Resolver } from '@nestjs/graphql';

@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}
}
