import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
// https://bejewelled-flan-378a6d.netlify.app
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173',"https://procesos-alimentarios.developers506.com"], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 3000;
  app.use(cookieParser());
  await app.listen(port);
}
bootstrap();
