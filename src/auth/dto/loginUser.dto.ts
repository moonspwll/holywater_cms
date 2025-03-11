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