import { Resolver } from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';

import { UserService } from '@app/user/user.service';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Query(() => String)
    getUser(): string {
        return this.userService.findByName();
        // return this.appService.getHello();
    }
}