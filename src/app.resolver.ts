import { Query, Resolver } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { AppService } from '@app/app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => String)
  getHello(): string {
    return this.appService.getHello();
  }
}