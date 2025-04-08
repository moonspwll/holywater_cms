import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { createKeyv } from '@keyv/redis';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';

import { AppController } from './app.controller';
import { AuthMiddleware } from '@app/user/middlewares/auth.middleware';
import { AppResolver } from '@app/app.resolver';
import { AppService } from './app.service';
import { UserModule } from '@app/user/user.module';
import { AuthModule } from '@app/auth/auth.module';
import { BookModule } from '@app/book/book.module';
import { DynamoModule } from '@app/dynamo/dynamo.module';
import { GqlThrottlerGuard } from '@app/guards/gqltrottle.guard';
import ormconfig from '@app/ormconfig';

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
      context: ({ req, res }) => ({ req, res }),
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ limit: 5, ttl: seconds(60) }],
      storage: new ThrottlerStorageRedisService(`redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:6379`),
    }),
    TypeOrmModule.forRoot(ormconfig),
    UserModule,
    AuthModule,
    BookModule,
    DynamoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
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