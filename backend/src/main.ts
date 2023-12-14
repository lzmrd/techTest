import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Create an instance of the Nest application using AppModule
  await app.listen(3000); // Start the application and listen on port 3000
}
bootstrap(); // Bootstrap the application by calling the bootstrap function
