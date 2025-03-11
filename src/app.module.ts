import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { join } from 'path';

import { AppController } from './app.controller';
import { AuthMiddleware } from '@app/user/middlewares/auth.middleware';
import { AppResolver } from '@app/app.resolver';
import { AppService } from './app.service';
import { UserModule } from '@app/user/user.module';
import { AuthModule } from '@app/auth/auth.module';
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
  UserModule,
  AuthModule,
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
