/**
 * A decorator to set metadata for user roles.
 * 
 * This decorator can be used to specify the roles required to access a particular route or controller.
 * 
 * @param {...UserRole[]} roles - The roles that are allowed to access the route or controller.
 * @returns {CustomDecorator<string>} - A custom decorator that sets the metadata for the roles.
 * 
 * @example
 * ```typescript
 * @Roles(UserRole.Admin, UserRole.Editor)
 * @Controller('example')
 * export class ExampleController {
 *   // ...
 * In this project it works also with GraphQL resolvers.
 * }
 * ```
 */
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@app/user/enums/user.role.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
