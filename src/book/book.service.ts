import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BookEntity } from '@app/book/book.entity';
import { CreateBookDto } from '@app/book/dto/createBook.dto';
import { UpdateBookDto } from '@app/book/dto/updateBook.dto';

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

    async updateBook(updateBookDto: UpdateBookDto): Promise<BookEntity> {
        const book = await this.bookRepository.findOne({ where: { id: updateBookDto.id }});

        if (!book) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }

        Object.assign(book, updateBookDto);

        return this.bookRepository.save(book, {});
    }

    async deleteBook(id: number): Promise<BookEntity> {
        const book = await this.bookRepository.findOne({ where: { id }});

        if (!book) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }

        await this.bookRepository.delete({ id });

        return book;
    }
}
