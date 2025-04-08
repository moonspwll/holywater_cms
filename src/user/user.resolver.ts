import { Resolver, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/graphql';

import { UserService } from '@app/user/user.service';
import { UserEntity } from '@app/user/user.entity';
import { BookEntity } from '@app/book/book.entity';
import { BookService } from '@app/book/book.service';
import { AuthGuard } from '@app/auth/guards/auth.guard';


@Resolver(() => UserEntity)
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly bookService: BookService,
    ) { }
    
    /**
     * Retrieves a user by their ID.
     * @param id - The ID of the user to retrieve.
     * @returns A promise that resolves to the user entity.
     */
    @UseGuards(AuthGuard)
    @Query(() => UserEntity)
    async getUserById(@Args('id', { type: () => String }) id: string): Promise<UserEntity> {
        return this.userService.findById(id);
    }

    @ResolveField('books', () => [BookEntity])
    /**
     * Retrieves a list of books associated with a specific user.
     *
     * @param user - The user entity whose books are to be fetched.
     * @returns A promise that resolves to an array of BookEntity objects.
     */
    async books(@Parent() user: UserEntity): Promise<BookEntity[]> {
        const { id } = user;
        return this.bookService.findBooksByUserId(id);
    }
}