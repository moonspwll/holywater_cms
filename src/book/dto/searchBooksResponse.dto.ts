import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BookEntity } from '@app/book/book.entity';

@ObjectType()
export class BookSearchResponse {
    @Field(() => [BookEntity])
    books: BookEntity[] | [];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;
}
