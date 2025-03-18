import { registerEnumType } from '@nestjs/graphql';

/**
 * Enum representing user roles within the system.
 * 
 * @enum {number}
 * @readonly
 */
export enum UserRole {
    USER = 1,
    MODERATOR = 2,
    ADMIN = 3
}

registerEnumType(UserRole, {
    name: 'UserRole',
});