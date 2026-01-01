import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestError extends HttpException {
    constructor(message: string) {
        super(
            {
                statusCode: HttpStatus.BAD_REQUEST,
                error: 'Bad Request',
                message,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
