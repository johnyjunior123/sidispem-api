import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UsePipes,
} from '@nestjs/common';
import type { Response } from 'express';
import { signInSchema, type SignInDTO } from 'src/dto/auth.dto';
import { ZodValidationPipe } from 'src/pipes/zod.validation.pipe';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @UsePipes(new ZodValidationPipe(signInSchema))
    @Post('login')
    async signIn(@Body() signInDto: SignInDTO, @Res() res: Response) {
        const signInData = await this.authService.signIn(signInDto);
        res.status(200).json(signInData)
    }

    @Post('validate')
    async validateToken(@Res() res: Response, @Body() { token }: { token: string }) {
        if (await this.authService.validateToken(token)) {
            return res.status(HttpStatus.OK).json({ message: 'Valited Token' });
        }
        return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ message: 'Expired Token ' });
    }
}
