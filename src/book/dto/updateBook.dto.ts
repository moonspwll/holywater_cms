import { IsNotEmpty, Max, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class UpdateBookDto {
    @Field(() => Int)
    @IsNotEmpty()
    readonly id: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNotEmpty()
    readonly title: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsNotEmpty()
    readonly authors: string;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNotEmpty()
    @Max(5)
    readonly average_rating: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNotEmpty()
    readonly isbn: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsNotEmpty()
    readonly isbn13: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNotEmpty()
    readonly num_pages: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNotEmpty()
    readonly ratings_count: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNotEmpty()
    readonly text_reviews_count: number;

    @Field(() => Date, { nullable: true })
    @IsOptional()
    @IsNotEmpty()
    // @Transform(({ value }) => new Date(value))
    readonly publication_date: Date;

    @Field({ nullable: true })
    @IsOptional()
    @IsNotEmpty()
    readonly publisher: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsNotEmpty()
    language_code: string;
}