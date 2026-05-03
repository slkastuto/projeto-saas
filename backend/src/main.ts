console.log('🔥 BACKEND CERTO INICIADO 🔥');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser'; // ✅ CORRETO

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const port = process.env.PORT || 3333;
  const isDev = process.env.NODE_ENV !== 'production';

  app.use(cookieParser()); // ✅ agora vai funcionar

  app.enableCors({
    origin: isDev
      ? ['http://localhost:3000', 'http://localhost:3001']
      : frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(port);

  console.log(`🚀 Backend rodando na porta ${port}`);
}

bootstrap();