import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';

import { UserEntity } from '@app/user/user.entity';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { JWT_SECRET } from '@app/config';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}
    findByName(): string {
        return 'USERRRRRR!!!!!';
    }
    
    /**
     * Creates a new user with the provided details.
     * 
     * @param {CreateUserDto} createUserDto - Data Transfer Object containing user details.
     * @returns {Promise<UserEntity>} - A promise that resolves to the created user entity.
     * 
     * @throws {HttpException} - Throws an exception if the email or username is already taken.
     */
    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const { email, password, username, bio, image } = createUserDto;

        const userByEmail = await this.userRepository.findOne({ where: { email }});
        const userByUsername = await this.userRepository.findOne({ where: { username }});
        
        if (userByEmail || userByUsername) {
            throw new HttpException('Email or username is already taken', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const user = this.userRepository.create({
            email,
            password,
            username,
            bio,
            image,
        });

        return this.userRepository.save(user);
    }

    /**
     * Finds a user by their ID.
     * 
     * @param id - The ID of the user to find.
     * @returns A promise that resolves to the found UserEntity.
     * @throws HttpException if the user is not found.
     */
    async findById(id: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { id }});
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    /**
     * Finds a user by their username.
     *
     * @param {string} username - The username of the user to find.
     * @returns {Promise<UserEntity>} A promise that resolves to the user entity if found.
     * @throws {HttpException} Throws an exception if no user is found with the given username.
     */
    async findByUsername(username: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { username }, select: ['id', 'email', 'username', 'bio', 'password', 'image']});

        if (!user) {
            throw new HttpException('There is no user with that username', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    /**
     * Generates a JSON Web Token (JWT) for the given user.
     *
     * @param {UserEntity} user - The user entity for which the JWT is generated.
     * @returns {string} The generated JWT as a string.
     */
    generateJwt(user: UserEntity): string {
        return sign({
            id: user.id,
            email: user.email,
            username: user.username,
        }, JWT_SECRET);
    }

    /**
     * Builds a response object for a user.
     *
     * @param {UserEntity} user - The user entity to build the response for.
     * @returns {any} The user response object, including a JWT token.
     */
    buildUserResponse(user: UserEntity): any {
        return {
            ...user,
            token: this.generateJwt(user),
        };
    }
}
