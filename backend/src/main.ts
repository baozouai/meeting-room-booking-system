import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { ConfigService } from '@nestjs/config';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';
import { CustomExceptionFilter } from './custom-exception.filter';
import { knife4jSetup } from 'nest-knife4j';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new FormatResponseInterceptor(),
    new InvokeRecordInterceptor(),
  );

  app.enableCors();

  app.useGlobalFilters(new CustomExceptionFilter());
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });
  const config = new DocumentBuilder()
    .setTitle('会议室预定系统')
    .setDescription('会议室预定系统接口文档')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);
  knife4jSetup(app, [
    {
      name: '会议室预定系统',
      url: 'api-doc-json',
      swaggerVersion: '1.0',
      location: '/api-doc-json',
    },
  ]);

  const configService = app.get(
    ConfigService<{
      NEST_SERVER_PORT: string;
    }>,
  );
  await app.listen(configService.get('NEST_SERVER_PORT'));
}
bootstrap();
