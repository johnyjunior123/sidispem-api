import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser, User } from 'src/entities/user';
import { UserService } from './user.service';

interface ISignIn {
    email: string;
    password: string;
}

export interface IAuth {
    token: string;
    user: Omit<IUser, 'password'>;
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) { }

    async signIn({ email, password }: ISignIn): Promise<IAuth> {
        if (!email) {
            new BadRequestException('E-mail inválido')
        }
        const user = new User(await this.usersService.findUserByEmail(email))
        if (!user) throw new NotFoundException();
        if (!user.comparePassword(password)) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.id, name: user.name };
        return {
            user: user.toSafe(),
            token: await this.jwtService.signAsync(payload),
        };
    }

    async jwtRecover({ id, email }): Promise<string> {
        const payload = { sub: id, email: email };
        return await this.jwtService.signAsync(payload);
    }

    async validateToken(token: string): Promise<boolean> {
        try {
            await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRETS,
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}
