import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(3002); // 👈 Customer service runs on port 3002
  console.log("Customer Service running on port 3002");
}
bootstrap();
