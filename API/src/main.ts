import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.use(cookieParser());

  await app.listen(3000);
};

bootstrap();
