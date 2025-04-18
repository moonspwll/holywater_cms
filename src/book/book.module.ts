import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { DynamoModule } from '@app/dynamo/dynamo.module';

import { BookResolver } from '@app/book/book.resolver';
import { BookService } from '@app/book/book.service';
import { BookRepository } from '@app/book/book.repository';
import { BookEntity } from '@app/book/book.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BookEntity]), CacheModule.register(), DynamoModule],
    providers: [BookResolver, BookService, BookRepository],
    exports: [BookService, BookRepository],
})
export class BookModule {};