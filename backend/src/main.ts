import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { ConfigService } from '@nestjs/config';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new FormatResponseInterceptor(),
    new InvokeRecordInterceptor(),
  );

  const configService = app.get(ConfigService);
  await app.listen(configService.get('NEST_SERVER_PORT'));
}
bootstrap();
