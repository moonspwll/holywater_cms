import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@app/user/enums/user.role.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
