import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserEntity } from './user.entity';

describe('UserResolver', () => {
    let resolver: UserResolver;
    let userService: UserService;

    const mockUserService = {
        findById: jest.fn((id: string) => {
            return Promise.resolve({
                id,
                email: 'emailuser@gmail.com',
                username: 'testUser',
                role: 1,
                bio: 'This is my bio',
                image: 'https://imgur.12312.com',
                createdAt: new Date(),
            } as UserEntity);
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserResolver,
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        resolver = module.get<UserResolver>(UserResolver);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    describe('getUserById', () => {
        it('should return a user entity', async () => {
            const result = await resolver.getUserById('1');
            expect(result).toEqual({
                id: '1',
                email: 'emailuser@gmail.com',
                username: 'testUser',
                role: 1,
                bio: 'This is my bio',
                image: 'https://imgur.12312.com',
                createdAt: new Date(),
            });
            expect(userService.findById).toHaveBeenCalledWith('1');
        });
    });
});