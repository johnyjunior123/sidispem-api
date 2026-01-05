import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/services/auth.service';
import { UsersModule } from './user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from 'src/controllers/auth.controller';
import { JwtAuthGuard } from 'src/filter/auth/jwt.auth.guard';
import { RolesGuard } from 'src/filter/auth/roles.guard';

@Module({
    imports: [
        forwardRef(() => UsersModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                global: true,
                secret: config.get<string>('JWT_SECRETS'),
                signOptions: { expiresIn: '1d' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthGuard, RolesGuard],
    exports: [AuthService, JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule { }
