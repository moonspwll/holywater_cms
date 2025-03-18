import { GqlExecutionContext } from '@nestjs/graphql';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
/**
 * AuthGuard is a guard that implements the `CanActivate` interface to determine
 * whether a request is authorized based on the presence of a user in the request context.
 *
 * @class
 * @implements {CanActivate}
 */
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        if (request.user) {
            return true;
        }

        throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }
}
