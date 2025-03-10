import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppResolver } from '@app/app.resolver';
import { AppService } from './app.service';
import { UserModule } from '@app/user/user.module';
import ormconfig from '@app/ormconfig';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), 
      driver: ApolloDriver,
      playground: true,
      sortSchema: true,
      path: '/api',
  }),
  TypeOrmModule.forRoot(ormconfig),
  UserModule
],
  controllers: [],
  providers: [AppService, AppResolver],
})
export class AppModule {}
