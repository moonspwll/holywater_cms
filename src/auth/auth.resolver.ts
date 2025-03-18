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
    /**
     * Registers a new user.
     * 
     * This mutation creates a new user using the data from `createUserDto`
     * and returns a user object with the appropriate response information.
     * 
     * @param {CreateUserDto} createUserDto - The object containing data to create a new user.
     * @returns {Promise<UserEntity>} - A promise that returns the user object after it is created.
     */
    async register(@Args('createUserDto') createUserDto: CreateUserDto): Promise<UserEntity> {
        const user = await this.userService.createUser(createUserDto);
        return this.userService.buildUserResponse(user);
    }

    @Mutation(() => UserEntity)
    /**
     * Logs in a user with provided credentials.
     * 
     * This mutation accepts a `loginUserDto` containing the username and password,
     * checks if the user exists, and if the password is correct. If successful,
     * it returns a user object excluding the password field.
     * 
     * @param {LoginUserDto} loginUserDto - The object containing the username and password to log in.
     * @returns {Promise<UserEntity>} - A promise that returns the user object (without the password) after successful login.
     * @throws {HttpException} - Throws an exception if the user does not exist or the password is incorrect.
     */
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