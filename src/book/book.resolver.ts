import { Mutation, Resolver, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Query, Context } from '@nestjs/graphql';

import { BookEntity } from '@app/book/book.entity';
import { BookService } from '@app/book/book.service';
import { CreateBookDto } from '@app/book/dto/createBook.dto';
import { UpdateBookDto } from '@app/book/dto/updateBook.dto';
import { SearchBooksDto } from '@app/book/dto/searchBooks.dto';
import { BookSearchResponse } from '@app/book/dto/searchBooksResponse.dto';

import { BookSearchRequest } from '@app/book/interfaces/book.search.interface';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { RolesGuard } from '@app/book/guards/roles.guard';
import { Roles } from '@app/book/decorators/roles.decorator';
import { UserRole } from '@app/user/enums/user.role.enum';
import { RequestExpress } from '@app/types/requestExpress.interface';


@Resolver(() => BookEntity)
export class BookResolver {
    constructor(private readonly bookService: BookService) { }
    @UseGuards(RolesGuard, AuthGuard)
    // ALL ROLES FOR TESTING
    @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER)
    @Mutation(() => BookEntity)
    /**
     * Creates a new book entity.
     * 
     * @param createBookDto - Data transfer object containing the details of the book to be created.
     * @param context - The context object containing the request, which includes the user information.
     * @returns A promise that resolves to the created BookEntity.
     */
    async createBook(@Args('createBookDto') createBookDto: CreateBookDto, @Context() context: { req: RequestExpress }): Promise<BookEntity> {
        const userId = context.req?.user?.id || '';
        return this.bookService.createBook(createBookDto, userId);
    }

    @UseGuards(RolesGuard, AuthGuard)
    @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER)
    @Query(() => BookSearchResponse)
    /**
     * Retrieves a list of books based on the provided search criteria.
     *
     * @param searchBooksDto - Data transfer object containing search criteria for books.
     * @param context - The request context containing the Express request object.
     * @returns A promise that resolves to a BookSearchRequest containing the search results.
     */
    async getBooks(@Args('searchBooksDto') searchBooksDto: SearchBooksDto, @Context() context: { req: RequestExpress }): Promise<BookSearchRequest> {
        return this.bookService.getBooks(searchBooksDto);
    }

    @UseGuards(RolesGuard, AuthGuard)
    @Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.USER)
    @Mutation(() => BookEntity)
    /**
     * Updates a book entity with the provided data.
     * 
     * @param updateBookDto - Data Transfer Object containing the updated book information.
     * @param context - The context object containing the request, which includes the user information.
     * @returns A promise that resolves to the updated BookEntity.
     */
    async updateBook(@Args('updateBookDto') updateBookDto: UpdateBookDto, @Context() context: { req: RequestExpress }): Promise<BookEntity> {
        const userId = context.req?.user?.id || '';
        return this.bookService.updateBook(updateBookDto, userId);
    }

    @UseGuards(RolesGuard, AuthGuard)
    @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER)
    @Mutation(() => BookEntity)
    /**
     * Deletes a book by its ID.
     * 
     * @param id - The ID of the book to delete.
     * @param context - The request context containing the user information.
     * @returns A promise that resolves to the deleted BookEntity.
     */
    async deleteBook(@Args('id', { type: () => Int }) id: number, @Context() context: { req: RequestExpress }): Promise<BookEntity> {
        const userId = context.req?.user?.id || '';
        return this.bookService.deleteBook(id, userId);
    }
}