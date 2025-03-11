import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
    USER = 1,
    MODERATOR = 2,
    ADMIN = 3
}

registerEnumType(UserRole, {
    name: 'UserRole',
});