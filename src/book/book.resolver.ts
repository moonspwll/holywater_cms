import { Mutation, Resolver, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Query, Context } from '@nestjs/graphql';

// import { UserService } from '@app/user/user.service';
import { BookEntity } from '@app/book/book.entity';
import { BookService } from '@app/book/book.service';
import { CreateBookDto } from '@app/book/dto/createBook.dto';
import { UpdateBookDto } from '@app/book/dto/updateBook.dto';
import { SearchBooksDto } from '@app/book/dto/searchBooks.dto';
import { BookSearchResponse } from '@app/book/dto/searchBooksResponse.dto';

import { BookSearchRequest } from '@app/book/interfaces/book.search.interface';
// import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { RolesGuard } from '@app/book/guards/roles.guard';
import { Roles } from '@app/book/decorators/roles.decorator';
import { UserRole } from '@app/user/enums/user.role.enum';
import { RequestExpress } from '@app/types/requestExpress.interface';


@Resolver(() => BookEntity)
export class BookResolver {
    constructor(private readonly bookService: BookService) { }
    /*
        ACCESS CONTROL LIST !!!!!
    */
    @Query(() => String!)
    @UseGuards(RolesGuard, AuthGuard)
    @Roles(UserRole.ADMIN)
    getString(): string {
        return 'this is book';
    }
    // CRUD
    @UseGuards(RolesGuard, AuthGuard)
    // TEMPORARY
    @Roles(UserRole.USER)
    @Mutation(() => BookEntity)
    async createBook(@Args('createBookDto') createBookDto: CreateBookDto, @Context() context: { req: RequestExpress }): Promise<BookEntity> {
        const userId = context.req?.user?.id || '';
        return this.bookService.createBook(createBookDto, userId);
    }

    @UseGuards(RolesGuard, AuthGuard)
    @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER)
    @Query(() => BookSearchResponse)
    async getBooks(@Args('searchBooksDto') searchBooksDto: SearchBooksDto, @Context() context: { req: RequestExpress }): Promise<BookSearchRequest> {
        return this.bookService.getBooks(searchBooksDto);
    }

    @UseGuards(RolesGuard, AuthGuard)
    // TEMPORARY
    @Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.USER)
    @Mutation(() => BookEntity)
    async updateBook(@Args('updateBookDto') updateBookDto: UpdateBookDto, @Context() context: { req: RequestExpress }): Promise<BookEntity> {
        const userId = context.req?.user?.id || '';
        return this.bookService.updateBook(updateBookDto, userId);
    }

    @UseGuards(RolesGuard, AuthGuard)
    @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER)
    @Mutation(() => BookEntity)
    async deleteBook(@Args('id', { type: () => Int }) id: number, @Context() context: { req: RequestExpress }): Promise<BookEntity> {
        const userId = context.req?.user?.id || '';
        return this.bookService.deleteBook(id, userId);
    }
}