import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('GraphXSource Challenge')
    .setDescription('An inventory management API')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(documentFactory()));

  await app.listen(process.env.PORT ?? 3000);
}
// Is fine NESTJS Handle it
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
