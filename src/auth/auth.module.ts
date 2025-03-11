import { Module } from '@nestjs/common';
import { AuthResolver } from '@app/auth/auth.resolver';
import { UserModule } from '@app/user/user.module';
import { UserService } from '@app/user/user.service';

@Module({
    controllers: [],
    imports: [UserModule],
    providers: [AuthResolver],
})

export class AuthModule {};