import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filter/exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(
    new AllExceptionsFilter()
  );
  let frontOrigin = ''
  if (process.env.NODE_ENV === 'development') {
    frontOrigin = 'http://localhost:3000';
  } else if (process.env.URL_FRONT) {
    frontOrigin = process.env.URL_FRONT; // ex: https://sidispem-front.vercel.app
  } else {
    throw new Error('A variável URL_FRONT não está definida no ambiente de produção!');
  }

  app.enableCors({
    origin: frontOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'If-None-Match'],
    credentials: false,
    preflightContinue: false,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
