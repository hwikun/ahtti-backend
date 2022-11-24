import { User } from './entities/user.entity';
import { LoginOutput, LoginInput } from './dtos/login.dto';
import { CreateUserOutput, CreateUserInput } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation((returns) => CreateUserOutput)
  createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.userService.createUser(createUserInput);
  }

  @Mutation((returns) => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginInput);
  }

  @Query((returns) => User)
  me(@Context() context) {
    if (!context.user) {
      return;
    } else {
      return context.user;
    }
  }
}
