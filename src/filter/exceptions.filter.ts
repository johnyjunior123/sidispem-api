import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { BadRequestError } from "./errors/badrequesterrors";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        console.error('EXCEPTION:', {
            message: exception.message,
            stack: exception.stack,
        });

        // Prisma Client Error
        if (exception.code && exception.clientVersion) {
            return response.status(400).json({
                statusCode: 400,
                error: 'Prisma Client Error',
                message: exception.message,
                meta: exception.meta,
            });
        }

        // BadRequestError personalizado
        if (exception instanceof BadRequestError) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                error: 'Bad Request',
                message: exception.message,
            });
        }

        // Default
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            error:
                exception instanceof HttpException
                    ? exception.getResponse()
                    : 'Internal server error',
        });
    }
}