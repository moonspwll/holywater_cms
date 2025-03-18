import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookEntity } from '@app/book/book.entity';
import { Repository } from 'typeorm';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { RolesGuard } from '@app/book/guards/roles.guard';
import { beforeEach } from 'node:test';

describe('BookResolver (e2e)', () => {
  let app: INestApplication;
  let bookRepository: Repository<BookEntity>;
    
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    bookRepository = moduleFixture.get<Repository<BookEntity>>(getRepositoryToken(BookEntity));
    await app.init();
    await bookRepository.query('TRUNCATE TABLE books CASCADE');
  });

  
  it('/graphql (POST) createBook', () => {
    return request(app.getHttpServer())
      .post('/api')
      .send({
        query: `
          mutation {
            createBook(createBookDto: { title: "Test Book #1", authors: "Test Author / Test Author 2", average_rating: 4.1, num_pages: 398, text_reviews_count: 1123, isbn: "123456788", isbn13: "1234567891239", language_code: "eng", publication_date: "2017-03-15", publisher: "Test Publisher", ratings_count: 1234 }) {
              id
              title
              authors
              average_rating
              num_pages
              text_reviews_count
              isbn
              isbn13
              language_code
              publication_date
              publisher
              ratings_count
            }
          }
        `,
      })
      .set('Authorization', 'Bearer mock-token')
      .expect(200)
      .expect((res) => {
        if (res.body.errors) {
          console.error(res.body.errors);
        }
        expect(res.body.data.createBook).toEqual({
          id: expect.any(String),
          title: 'Test Book #1',
          authors: 'Test Author / Test Author 2',
          average_rating: 4.1,
          num_pages: 398,
          text_reviews_count: 1123,
          isbn: '123456788',
          isbn13: '1234567891239',
          language_code: 'eng',
          publication_date: '2017-03-15T00:00:00.000Z',
          publisher: 'Test Publisher',
          ratings_count: 1234,
        });
      });
  });

  it('/api (POST) updateBook', async () => {
    const book = await bookRepository.save({
      title: 'Test Book #1',
      authors: 'Test Author / Test Author 2',
      average_rating: 4.1,
      num_pages: 398,
      text_reviews_count: 1123,
      isbn: '123456789',
      isbn13: '1234567891234',
      language_code: 'eng',
      publication_date: new Date('2017-03-15'),
      publisher: 'Test Publisher',
      ratings_count: 1234,
    });

    return request(app.getHttpServer())
      .post('/api')
      .send({
        query: `
          mutation {
            updateBook(updateBookDto: { id: ${+book.id}, title: "Updated Test Book", authors: "Updated Test Author", average_rating: 4.5, num_pages: 400, text_reviews_count: 1200, isbn: "987654321", isbn13: "9876543219876", language_code: "eng", publication_date: "2022-01-01", publisher: "Updated Publisher", ratings_count: 1500 }) {
              id
              title
              authors
              average_rating
              num_pages
              text_reviews_count
              isbn
              isbn13
              language_code
              publisher
              ratings_count
              publication_date
            }
          }
        `,
      })
      .set('Authorization', 'Bearer mock-token')
      .expect(200)
      .expect((res) => {
        if (res.body.errors) {
            console.error(res.body.errors);
        }
        expect(res.body.data.updateBook).toEqual({
          id: `${book.id}`,
          title: 'Updated Test Book',
          authors: 'Updated Test Author',
          average_rating: 4.5,
          num_pages: 400,
          text_reviews_count: 1200,
          isbn: '987654321',
          isbn13: '9876543219876',
          language_code: 'eng',
          publication_date: '2022-01-01T00:00:00.000Z',
          publisher: 'Updated Publisher',
          ratings_count: 1500,
        });
      });
    });

afterAll(async () => {
    await app.close();
  });
});

  