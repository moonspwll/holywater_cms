import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserResolver } from '@app/user/user.resolver';
import { UserService } from '@app/user/user.service';
import { UserEntity } from '@app/user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UserResolver, UserService],
    // Export the UserService class so that it can be used in other modules
    exports: [UserService],
})
export class UserModule {};