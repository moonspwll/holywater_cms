/**
 * Data Transfer Object (DTO) for user login.
 * This class is used to validate and transfer login data.
 * 
 * @class LoginUserDto
 * 
 * @property {string} username - The username of the user. This field is required.
 * @property {string} password - The password of the user. This field is required.
 */
import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginUserDto {
    @Field()
    @IsNotEmpty()
    readonly username: string;

    @Field()
    @IsNotEmpty()
    readonly password: string;
}