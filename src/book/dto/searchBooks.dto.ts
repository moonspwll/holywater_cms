import { IsNotEmpty, Max, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { InputType, Field, Int, Float } from '@nestjs/graphql';


@InputType()
export class SearchBooksDto {
    @Field({ nullable: true })
    @IsOptional()
    @IsNotEmpty()
    readonly title?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsNotEmpty()
    readonly authors?: string;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNotEmpty()
    @Max(5)
    readonly average_rating?: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNotEmpty()
    readonly num_pages?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNotEmpty()
    // @Transform(({ value }) => new Date(value))
    readonly publication_date?: string;

    @Field({ nullable: true })
    readonly sort_by?: string;

    @Field(() => Int, { nullable: true })
    readonly page?: number;

    @Field(() => Int, { nullable: true })
    readonly page_size?: number;

    @Field({ nullable: true })
    readonly order?: string;
}