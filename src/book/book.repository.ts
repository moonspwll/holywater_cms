import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from '@app/book/book.entity';

@Injectable()
export class BookRepository {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepo: Repository<BookEntity>,
  ) {}

  async findAll(): Promise<BookEntity[]> {
    return this.bookRepo.find();
  }

  async findById(id: number): Promise<BookEntity | null> {
    return this.bookRepo.findOne({ where: { id } });
  }

  async create(bookData: Partial<BookEntity>): Promise<BookEntity> {
    const book = this.bookRepo.create(bookData);
    return this.bookRepo.save(book);
  }

  async update(id: number, bookData: Partial<BookEntity>): Promise<BookEntity | null> {
    await this.bookRepo.update(id, bookData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.bookRepo.delete(id);
  }
}