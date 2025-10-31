import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = parseInt(process.env.PORT || '4000', 10);
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Backend running on http://localhost:${port}`);
}

bootstrap();









