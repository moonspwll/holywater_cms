import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppResolver } from '@app/app.resolver';
import { AppService } from './app.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), 
      driver: ApolloDriver,
      playground: true,
      sortSchema: true,
  })
],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
