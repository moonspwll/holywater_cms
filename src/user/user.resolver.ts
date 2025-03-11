import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';

import { UserService } from '@app/user/user.service';
import { UserEntity } from '@app/user/user.entity';
import { CreateUserDto } from '@app/user/dto/createUser.dto';


@Resolver(() => UserEntity)
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Query(() => String)
    getUser(): string {
        return this.userService.findByName();
    }

    @Mutation(() => UserEntity)
    createUser(@Args('createUserDto') createUserDto: CreateUserDto): Promise<UserEntity> {
        return this.userService.createUser(createUserDto);
    }
}