import { IsEmail, IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { UserRole } from '@app/user/enums/user.role.enum';

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