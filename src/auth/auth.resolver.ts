import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { compare } from 'bcrypt';

import { UserService } from '@app/user/user.service';
import { UserEntity } from '@app/user/user.entity';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { LoginUserDto } from '@app/auth/dto/loginUser.dto';

@Resolver(() => UserEntity)
export class AuthResolver {
    constructor(private readonly userService: UserService) { }
    @Mutation(() => UserEntity)
    async register(@Args('createUserDto') createUserDto: CreateUserDto): Promise<UserEntity> {
        const user = await this.userService.createUser(createUserDto);
        return this.userService.buildUserResponse(user);
    }

    @Mutation(() => UserEntity)
    async login(@Args('loginUserDto') loginUserDto: LoginUserDto): Promise<UserEntity> {
        const user = await this.userService.findByUsername(loginUserDto.username);

        
        if (!user) {
            throw new HttpException('No user with that credentials', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const passwordIsCorrect = await compare(loginUserDto.password, user.password);
        
        if (!passwordIsCorrect) {
            throw new HttpException('Credentials are invalid', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        delete user.password;
        return this.userService.buildUserResponse(user);
    }
}