import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { RequestExpress } from '@app/types/requestExpress.interface';
import { JWT_SECRET } from '@app/config';
import { UserService } from '@app/user/user.service';

@Injectable()

/**
 * Middleware that handles authentication for incoming requests.
 * 
 * This middleware checks for the presence of an authorization header in the request.
 * If the header is present, it verifies the JWT token and attaches the corresponding user
 * to the request object. If the token is invalid or not present, it sets the user to null.
 * 
 * @class AuthMiddleware
 * @implements {NestMiddleware}
 * 
 * @constructor
 * @param {UserService} userService - The user service used to fetch user details.
 * 
 * @method use
 * @async
 * @param {RequestExpress} req - The incoming request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * 
 * @returns {Promise<void>}
 */
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) { }

    async use(req: RequestExpress, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            req.user = null;
            next();
            return;
        }

        const token = req.headers.authorization.split(' ')[1];

        try {
            const decoded = await verify(token, JWT_SECRET);
            req.user = await this.userService.findById(decoded.id);
        } catch (e) {
            req.user = null;
        }

        next();
    }
}