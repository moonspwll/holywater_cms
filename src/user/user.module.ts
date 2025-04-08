import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserResolver } from '@app/user/user.resolver';
import { UserService } from '@app/user/user.service';
import { BookModule } from '@app/book/book.module';
import { UserEntity } from '@app/user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), BookModule],
    providers: [UserResolver, UserService],
    exports: [UserService],
})
export class UserModule {};