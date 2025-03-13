import { BookEntity } from '@app/book/book.entity';

export interface BookSearchRequest {
    books: BookEntity[];
    page: number;
    total: number;
}