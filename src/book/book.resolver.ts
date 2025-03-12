import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/graphql';

// import { UserService } from '@app/user/user.service';
import { BookEntity } from '@app/book/book.entity';
import { BookService } from '@app/book/book.service';
import { CreateBookDto } from '@app/book/dto/createBook.dto';
// import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { RolesGuard } from '@app/book/guards/roles.guard';
import { Roles } from '@app/book/decorators/roles.decorator';
import { UserRole } from '@app/user/enums/user.role.enum';


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

    @UseGuards(AuthGuard)
    @Mutation(() => BookEntity)
    async createBook(@Args('createBookDto') createBookDto: CreateBookDto): Promise<BookEntity> {
        return this.bookService.createBook(createBookDto);
    }
}