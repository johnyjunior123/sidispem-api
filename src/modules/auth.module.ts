import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/services/auth.service';
import { UsersModule } from './user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from 'src/controllers/auth.controller';

@Module({
    imports: [
        UsersModule,
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
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule { }
