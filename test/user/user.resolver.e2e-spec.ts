import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { UserService } from '@app/user/user.service';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import { UserRole } from '@app/user/enums/user.role.enum';

describe('UserResolver (e2e)', () => {
  let app: INestApplication;
  let userService = {
    findById: (id: string) => ({
    id: '1',
    email: 'emailuser@gmail.com',
    username: 'testUser',
    role: UserRole.USER,
    bio: 'This is my bio',
    image: 'https://imgur.12312.com',
    createdAt: new Date(),
    }) 
};

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api (POST) getUserById', () => {
    return request(app.getHttpServer())
      .post('/api')
      .send({
        query: `
          query {
            getUserById(id: "1") {
              id
              username
              role
              email
              bio
              image
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
        expect(res.body.data.getUserById).toEqual({
            id: '1',
            email: 'emailuser@gmail.com',
            username: 'testUser',
            role: 'USER',
            bio: 'This is my bio',
            image: 'https://imgur.12312.com',
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
