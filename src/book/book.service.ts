import { Repository } from 'typeorm';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { BookRepository } from '@app/book/book.repository';

import { BookEntity } from '@app/book/book.entity';
import { CreateBookDto } from '@app/book/dto/createBook.dto';
import { UpdateBookDto } from '@app/book/dto/updateBook.dto';
import { SearchBooksDto } from '@app/book/dto/searchBooks.dto';
import { DynamoService } from '@app/dynamo/dynamo.service';

import { BookSearchRequest } from '@app/book/interfaces/book.search.interface';

@Injectable()
export class BookService {
    constructor(
        private readonly bookRepository: BookRepository,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,

        private readonly dynamoService: DynamoService,
    ) {}

    private readonly DYNAMODB_TABLE_NAME: string = 'UserActivityLogs';
    
    /**
     * Creates a new book entity and saves it to the database.
     * Additionally, logs the creation activity to DynamoDB.
     *
     * @param createBookDto - Data Transfer Object containing the details of the book to be created.
     * @param userId - The ID of the user creating the book.
     * @returns A promise that resolves to the created BookEntity.
     * @throws HttpException if there is an error during the book creation process.
     */
    async createBook(createBookDto: CreateBookDto, userId: string): Promise<BookEntity> {
        const book: BookEntity = this.bookRepository.create(createBookDto);

        book.user_id = userId;

        let savedBook: BookEntity;

        try {
            savedBook = await this.bookRepository.save(book);
        } catch (error) {
            throw new HttpException('Error creating book', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        this.dynamoService.putItem(this.DYNAMODB_TABLE_NAME,
            {
                ActivityType: 'create',
                UserId: userId || 'test',
                Timestamp: new Date().getTime(),
                bookId: savedBook.id 
            }
        );

        return savedBook;
    }

    /**
     * Updates an existing book with the provided data.
     * 
     * @param updateBookDto - Data Transfer Object containing the updated book information.
     * @param userId - The ID of the user performing the update.
     * @returns A promise that resolves to the updated BookEntity.
     * @throws HttpException - If the book is not found.
     */
    async updateBook(updateBookDto: UpdateBookDto, userId: string): Promise<BookEntity> {
        const book = await this.bookRepository.findOne({ where: { id: updateBookDto.id, user_id: userId }});
        if (!book) {
            throw new HttpException('Book not found, or you do not have sufficient permissions to edit books added by other users.', HttpStatus.NOT_FOUND);
        }

        this.dynamoService.putItem(this.DYNAMODB_TABLE_NAME,
            {
                ActivityType: 'update',
                UserId: userId || 'test',
                Timestamp: new Date().getTime(),
                bookId: book.id,
                updatedFields: JSON.stringify(updateBookDto),
            }
        );

        Object.assign(book, updateBookDto);

        return this.bookRepository.save(book);
    }

    /**
     * Deletes a book by its ID and logs the activity to DynamoDB.
     *
     * @param {number} id - The ID of the book to delete.
     * @param {string} userId - The ID of the user performing the deletion.
     * @returns {Promise<BookEntity>} - The deleted book entity.
     * @throws {HttpException} - Throws an exception if the book is not found.
     */
    async deleteBook(id: number, userId: string): Promise<BookEntity> {
        const book = await this.bookRepository.findOne({ where: { id, user_id: userId }});

        if (!book) {
            throw new HttpException('Book not found, or you do not have sufficient permissions to delete books added by other users.', HttpStatus.NOT_FOUND);
        }

        this.dynamoService.putItem(this.DYNAMODB_TABLE_NAME,
            {
                ActivityType: 'delete',
                UserId: userId,
                Timestamp: new Date().getTime(),
                bookId: book.id,
            }
        );

        await this.bookRepository.delete({ id });

        return book;
    }

    /**
     * Retrieves a list of books based on the provided search criteria.
     *
     * @param {SearchBooksDto} searchBooksDto - The data transfer object containing search criteria.
     * @returns {Promise<BookSearchRequest>} A promise that resolves to a book search request object containing the search results.
     *
     * The search criteria can include:
     * - `title` (string): The title of the book to search for.
     * - `authors` (string): The authors of the book to search for.
     * - `average_rating` (number): The minimum average rating of the book.
     * - `num_pages` (number): The minimum number of pages of the book.
     * - `publication_date` (string): The publication year of the book.
     * - `sort_by` (string): The field to sort the results by (default is 'average_rating').
     * - `page` (number): The page number for pagination (default is 1).
     * - `page_size` (number): The number of results per page (default is 10).
     * - `order` (string): The order of sorting, either 'ASC' or 'DESC' (default is 'DESC').
     *
     * The method first checks if the results are cached. If cached results are found, they are returned.
     * Otherwise, it constructs a query based on the search criteria, executes the query, caches the results,
     * and returns the search results along with the total count of books and the current page number.
     */
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
    
        // Перевіряємо кеш
        const cacheKey = this.generateCacheKey(searchBooksDto);
        const cachedResults = await this.cacheManager.get<string>(cacheKey);

        const validOrder = order && ['ASC', 'DESC'].includes(order) ? order : 'DESC';
    
        if (cachedResults) {
          return JSON.parse(cachedResults);
        }
    
        // Викликаємо метод із репозиторію для пошуку книг
        const { books, total } = await this.bookRepository.searchBooks({
          title,
          authors,
          average_rating,
          num_pages,
          publication_date,
          sort_by,
          order: validOrder,
          page,
          page_size,
        });
    
        // Кешуємо результати
        const result: BookSearchRequest = {
          books,
          total,
          page,
        };
    
        await this.cacheManager.set(cacheKey, JSON.stringify(result), 60 * 1000);
    
        return result;
      }

    /**
     * Generates a cache key based on the properties of the provided SearchBooksDto object.
     * The cache key is constructed by concatenating the key-value pairs of the dto object
     * in the format `key=value` and joining them with an ampersand (&).
     *
     * @param dto - The data transfer object containing the search parameters for books.
     * @returns A string representing the cache key.
     */
    private generateCacheKey(dto: SearchBooksDto): string {
        return `books:${Object.entries(dto)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`;
    }
      
}
