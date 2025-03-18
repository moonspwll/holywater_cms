import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { UserService } from '@app/user/user.service';

describe('UserResolver (e2e)', () => {
  let app: INestApplication;
  let userService = { findById: (id: string) => ({ id, name: 'Test User' }) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/graphql (POST) getUserById', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            getUserById(id: "1") {
              id
              name
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.getUserById).toEqual({
          id: '1',
          name: 'Test User',
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
