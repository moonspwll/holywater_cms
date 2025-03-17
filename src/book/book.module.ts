import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import { BookResolver } from '@app/book/book.resolver';
import { BookService } from '@app/book/book.service';
import { BookEntity } from '@app/book/book.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BookEntity]), CacheModule.register()],
    providers: [BookResolver, BookService],
})
export class BookModule {};