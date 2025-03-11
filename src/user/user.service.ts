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
    /*
        comment and testing
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

    async findById(id: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { id }});
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    generateJwt(user: UserEntity): string {
        return sign({
            id: user.id,
            email: user.email,
            username: user.username,
        }, JWT_SECRET);
    }

    buildUserResponse(user: UserEntity): any {
        console.log('asd', {
            user: {
                ...user,
                token: this.generateJwt(user),
            }
        });
        return {
            ...user,
            token: this.generateJwt(user),
        };
    }
}
