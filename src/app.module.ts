import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { join } from 'path';

import { AppController } from './app.controller';
import { AuthMiddleware } from '@app/user/middlewares/auth.middleware';
import { AppResolver } from '@app/app.resolver';
import { AppService } from './app.service';
import { UserModule } from '@app/user/user.module';
import { AuthModule } from '@app/auth/auth.module';
import { BookModule } from '@app/book/book.module';
import { DynamoModule } from '@app/dynamo/dynamo.module';
import ormconfig from '@app/ormconfig';
import { UserService } from './user/user.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          store: createKeyv(`redis://${process.env.REDIS_HOST}:6379`),
        };
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), 
      driver: ApolloDriver,
      playground: true,
      sortSchema: true,
      path: '/api',
  }),
  TypeOrmModule.forRoot(ormconfig),
  UserModule,
  AuthModule,
  BookModule,
  DynamoModule,
],
  controllers: [],
  providers: [AppService, AppResolver],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
