import { AppService } from './app.service';
import { Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}
  @Query((returns) => String)
  hi() {
    return this.appService.getHello();
  }
}
