import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookResolver } from '@app/book/book.resolver';
import { BookService } from '@app/book/book.service';
import { BookEntity } from '@app/book/book.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BookEntity])],
    providers: [BookResolver, BookService],
})
export class BookModule {};