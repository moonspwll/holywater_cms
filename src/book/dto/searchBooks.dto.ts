import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsOptional, IsNotEmpty, Max, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Data Transfer Object (DTO) for searching books.
 * This class is used to define the structure of the data that can be used to search for books.
 * It includes various optional fields that can be used to filter the search results.
 */
@InputType()
export class SearchBooksDto {
    /**
     * The title of the book to search for.
     * This field is optional.
     * If the value is an empty string, it will be transformed to `undefined`.
     */
    @Field({ nullable: true })
    @IsOptional()
    @Transform(({ value }) => (value === "" ? undefined : value))
    readonly title?: string;

    /**
     * The authors of the book to search for.
     * This field is optional.
     * If the value is an empty string, it will be transformed to `undefined`.
     */
    @Field({ nullable: true })
    @IsOptional()
    @Transform(({ value }) => (value === "" ? undefined : value))
    readonly authors?: string;

    /**
     * The average rating of the book to search for.
     * This field is optional.
     * The value must not be empty and must be less than or equal to 5.
     */
    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNotEmpty()
    @Max(5)
    readonly average_rating?: number;

    /**
     * The number of pages of the book to search for.
     * This field is optional.
     * If the value is 0, it will be transformed to `undefined`.
     */
    @Field(() => Int, { nullable: true })
    @IsOptional()
    @Transform(({ value }) => (value === 0 ? undefined : value))
    readonly num_pages?: number;

    /**
     * The publication date of the book to search for.
     * This field is optional.
     * If the value is an empty string, it will be transformed to `undefined`.
     */
    @Field({ nullable: true })
    @IsOptional()
    @Transform(({ value }) => (value === "" ? undefined : value))
    readonly publication_date?: string;

    /**
     * The field to sort the search results by.
     * This field is optional.
     */
    @Field({ nullable: true })
    readonly sort_by?: string;

    /**
     * The page number of the search results.
     * This field is optional.
     */
    @Field(() => Int, { nullable: true })
    readonly page?: number;

    /**
     * The number of results per page.
     * This field is optional.
     */
    @Field(() => Int, { nullable: true })
    readonly page_size?: number;

    /**
     * The order of the search results (e.g., ascending or descending).
     * This field is optional.
     */
    @Field({ nullable: true })
    @IsIn(['ASC', 'DESC'])
    readonly order?: 'ASC' | 'DESC';
}