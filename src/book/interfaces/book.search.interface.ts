import { BookEntity } from '@app/book/book.entity';
/**
 * Interface representing a request for searching books.
 */
export interface BookSearchRequest {
    /**
     * An array of BookEntity objects representing the books found in the search.
     */
    books: BookEntity[];

    /**
     * The current page number of the search results.
     */
    page: number;

    /**
     * The total number of books found in the search.
     */
    total: number;
}