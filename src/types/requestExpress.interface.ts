import { UserEntity } from '@app/user/user.entity';
import { Request } from 'express';

export interface RequestExpress extends Request {
    user?: UserEntity | null;
}