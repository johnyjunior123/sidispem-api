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
        if (!email || !email.includes('@')) {
            throw new BadRequestException('E-mail inválido');
        }

        const userData = await this.usersService.findUserByEmail(email);
        if (!userData) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const user = new User(userData);
        console.log('Senha fornecida:', password);
        console.log('Hash armazenado:', user.password); // ou user.passwordHash
        console.log('Comparação:', user.comparePassword(password));

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Senha incorreta');
        }

        const payload = {
            sub: user.id,
            name: user.name,
            email: user.email,
            role: user.role 
        };

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
