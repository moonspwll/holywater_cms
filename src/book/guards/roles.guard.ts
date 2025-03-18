/**
 * Guard that checks if the user has the required roles to access a particular route or resolver.
 * 
 * This guard uses the `Reflector` service to retrieve the roles metadata set on the route or resolver.
 * It then checks if the user's role matches any of the required roles.
 * 
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '@app/user/enums/user.role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const { user } = gqlContext.getContext().req;

    return requiredRoles.includes(user?.role);
  }
}
