import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BookEntity } from '@app/book/book.entity';
import { CreateBookDto } from '@app/book/dto/createBook.dto';

@Injectable()
export class BookService {
    constructor(@InjectRepository(BookEntity) private readonly bookRepository: Repository<BookEntity>) {}
    /*
        comment and testing
    */
    async createBook(createBookDto: CreateBookDto): Promise<BookEntity> {
        const book: BookEntity = this.bookRepository.create(createBookDto);

        return this.bookRepository.save(book);
    }
}
