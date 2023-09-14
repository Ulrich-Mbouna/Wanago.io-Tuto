import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3 } from '@aws-sdk/client-s3';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get(Reflector)
  ))
  const configService = app.get(ConfigService);

  // const s3Client = new S3.S3Client({
  //   region: configService.get('AWS_REGION'),
  // })
  await app.listen(3000);
}
bootstrap();
