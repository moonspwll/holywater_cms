import { GqlExecutionContext } from '@nestjs/graphql';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
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
