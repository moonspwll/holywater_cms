import { UserEntity } from '@app/user/user.entity';
import { Request } from 'express';

/**
 * Extends the Express Request interface to include an optional user property.
 * The user property can be of type UserEntity or null.
 * 
 * @interface RequestExpress
 * @extends {Request}
 * @property {UserEntity | null} [user] - Optional user property that can be either a UserEntity object or null.
 */
export interface RequestExpress extends Request {
    user?: UserEntity | null;
}