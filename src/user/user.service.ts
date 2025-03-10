import { EntityRepository, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}
    findByName(): string {
        return 'USERRRRRR!!!!!';
        // return this.userRepository.findOne({ where: {clientName} });
    }
}
