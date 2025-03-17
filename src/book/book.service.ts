import { Repository } from 'typeorm';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';

import { BookEntity } from '@app/book/book.entity';
import { CreateBookDto } from '@app/book/dto/createBook.dto';
import { UpdateBookDto } from '@app/book/dto/updateBook.dto';
import { SearchBooksDto } from '@app/book/dto/searchBooks.dto';

import { BookSearchRequest } from '@app/book/interfaces/book.search.interface';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(BookEntity)
        private readonly bookRepository: Repository<BookEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}
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

    async getBooks(searchBooksDto: SearchBooksDto): Promise<BookSearchRequest> {
        const {
            title = '',
            authors = '',
            average_rating = 0,
            num_pages = 0,
            publication_date, 
            sort_by = 'average_rating', 
            page = 1,
            page_size = 10,
            order = 'DESC',
        } = searchBooksDto;

        const cacheKey = this.generateCacheKey(searchBooksDto);
        const cachedResults = await this.cacheManager.get<string>(cacheKey);
        
        if (cachedResults) {
            return JSON.parse(cachedResults);
        }
        const queryBuilder = this.bookRepository.createQueryBuilder('book');
        // Search by title
        if (title) {
            queryBuilder.andWhere('book.title ILIKE :title', { title: `%${title}%` });
        }
        // Search by authors
        if (authors) {
            queryBuilder.andWhere('book.authors ILIKE :authors', { authors: `%${authors}%` });
        }
        // Search by average rating
        if (average_rating) {
            queryBuilder.andWhere('book.average_rating >= :average_rating', { average_rating });
        }

        // Search by number of pages
        if (num_pages) {
            queryBuilder.andWhere('book.num_pages >= :num_pages', { num_pages });
        }

        // Search by publication year
        if (publication_date) {
            queryBuilder.andWhere('EXTRACT(YEAR FROM book.publication_date) = :publication_date', { publication_date });
        }

        // Sort the results
        queryBuilder.orderBy(`book.${sort_by}`, order as 'ASC' | 'DESC');

        // Paginate the results and sort them
        queryBuilder.skip((page - 1) * page_size);

        queryBuilder.take(page_size);

        // Get the results
        const searchResults = await queryBuilder.getMany();
        // Get total count of books
        const count = await queryBuilder.getCount();

        this.cacheManager.set(cacheKey, JSON.stringify({
            books: searchResults,
            total: count,
            page,
        }), 60 * 1000);

        return {
            books: searchResults,
            total: count,
            page,
        }

    }

    private generateCacheKey(dto: SearchBooksDto): string {
        return `books:${Object.entries(dto)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`;
    }
      
}
