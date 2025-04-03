/**
 * Data Transfer Object (DTO) for creating a new book.
 * This class is used to define the structure and validation rules for the book creation input.
 */
import { IsNotEmpty, Max, IsNumber } from 'class-validator';
import { InputType, Field, GraphQLISODateTime, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateBookDto {
    @Field()
    @IsNotEmpty()
    readonly title: string;

    @Field()
    @IsNotEmpty()
    readonly authors: string;

    @Field(() => Float)
    @IsNotEmpty()
    @Max(5)
    readonly average_rating: number;

    @Field()
    @IsNotEmpty()
    readonly isbn: string;

    @Field()
    @IsNotEmpty()
    readonly isbn13: string;

    @Field(() => Int)
    @IsNumber()
    @IsNotEmpty()
    readonly num_pages: number;

    @Field(() => Int)
    @IsNotEmpty()
    readonly ratings_count: number;

    @Field(() => Int)
    @IsNotEmpty()
    readonly text_reviews_count: number;

    @Field()
    @IsNotEmpty()
    readonly publication_date: string;

    @Field()
    @IsNotEmpty()
    readonly publisher: string;

    @Field()
    @IsNotEmpty()
    language_code: string;

    // @Field()
    // @IsNotEmpty()
    // readonly user_id: string;
}