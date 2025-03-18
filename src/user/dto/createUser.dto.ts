import { IsEmail, IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

/**
 * Data Transfer Object (DTO) for creating a new user.
 * This class is used to define the structure of the data required to create a new user.
 * It includes fields for username, email, password, bio, and image.
 * 
 * @decorator `@InputType` - GraphQL decorator to mark this class as an input type.
 */
@InputType()
export class CreateUserDto {
    @Field()
    @IsNotEmpty()
    readonly username: string;

    @Field()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @Field()
    @IsNotEmpty()
    readonly password: string;

    @Field({ nullable: true })
    readonly bio?: string;

    @Field({ nullable: true })
    readonly image?: string
}