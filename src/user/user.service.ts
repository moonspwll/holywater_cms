import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '@app/user/user.entity';
import { CreateUserDto } from '@app/user/dto/createUser.dto';

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
        const { email, password, username } = createUserDto;

        const userByEmail = await this.userRepository.findOne({ where: { email }});
        const userByUsername = await this.userRepository.findOne({ where: { username }});
        
        if (userByEmail || userByUsername) {
            throw new HttpException('Email or username is already taken', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        console.log('test', userByEmail, userByUsername);

        const user = this.userRepository.create({
            email,
            password,
            username,
        });

        return this.userRepository.save(user);
    }
}
