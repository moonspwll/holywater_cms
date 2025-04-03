import { Repository, FindOneOptions, DeleteResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from '@app/book/book.entity';
import { CreateBookDto } from '@app/book/dto/createBook.dto';
import { UpdateBookDto } from '@app/book/dto/updateBook.dto';
import { SearchBooksDto } from '@app/book/dto/searchBooks.dto';

@Injectable()
export class BookRepository {
  constructor(
    @InjectRepository(BookEntity)
    private readonly repo: Repository<BookEntity>,
  ) {}

  getRepository(): Repository<BookEntity> {
    return this.repo;
  }

  create(book: CreateBookDto): BookEntity {
    return this.repo.create(book);
  }

  async save(book: BookEntity): Promise<BookEntity> {
    return this.repo.save(book);
  }

  async findOne(options: FindOneOptions<BookEntity>): Promise<BookEntity | null> {
    return this.repo.findOne(options);
  }

  async delete(criteria: { id: number }): Promise<DeleteResult> {
    return this.repo.delete(criteria);
  }

  async searchBooks(
    searchCriteria: {
      title?: string;
      authors?: string;
      average_rating?: number;
      num_pages?: number;
      publication_date?: string;
      sort_by?: string;
      order?: 'ASC' | 'DESC';
      page: number;
      page_size: number;
    },
  ): Promise<{ books: BookEntity[]; total: number }> {
    try {
        const {
          title = '',
          authors = '',
          average_rating = 0,
          num_pages = 0,
          publication_date,
          sort_by = 'average_rating',
          order = 'DESC',
          page = 1,
          page_size = 10,
        } = searchCriteria;
    
        // const queryBuilder = this.bookRepository.createQueryBuilder('book');
        const queryBuilder = this.getRepository().createQueryBuilder('book');
    
        if (title) {
          queryBuilder.andWhere('book.title ILIKE :title', { title: `%${title}%` });
        }
    
        if (authors) {
          queryBuilder.andWhere('book.authors ILIKE :authors', { authors: `%${authors}%` });
        }
    
        if (average_rating) {
          queryBuilder.andWhere('book.average_rating >= :average_rating', { average_rating });
        }
    
        if (num_pages) {
          queryBuilder.andWhere('book.num_pages >= :num_pages', { num_pages });
        }
    
        if (publication_date) {
          queryBuilder.andWhere('EXTRACT(YEAR FROM book.publication_date) = :publication_date', {
            publication_date,
          });
        }
    
        queryBuilder.orderBy(`book.${sort_by}`, order);
        queryBuilder.skip((page - 1) * page_size);
        queryBuilder.take(page_size);
    
        const [books, total] = await queryBuilder.getManyAndCount();
    
        return { books, total };
      } catch (error) {
        throw new Error(`Error searching books: ${error.message}`);
      }
  }
}