import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/graphql';

import { UserService } from '@app/user/user.service';
import { UserEntity } from '@app/user/user.entity';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { AuthGuard } from '@app/auth/guards/auth.guard';


@Resolver(() => UserEntity)
export class UserResolver {
    constructor(private readonly userService: UserService) { }
    
    /**
     * Retrieves a user by their ID.
     * @param id - The ID of the user to retrieve.
     * @returns A promise that resolves to the user entity.
     */
    @UseGuards(AuthGuard)
    @Query(() => UserEntity)
    async getUserById(@Args('id', { type: () => String }) id: string): Promise<UserEntity> {
        return this.userService.findById(id);
    }
}