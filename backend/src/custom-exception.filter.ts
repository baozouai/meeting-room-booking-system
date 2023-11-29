import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();
    const exceptionMessage = (
      exception.getResponse() as {
        message: string | string[];
      }
    ).message;
    response.status(exception.getStatus()).json({
      code: exception.getStatus(),
      message: 'fail',
      data: Array.isArray(exceptionMessage)
        ? exceptionMessage.join(',')
        : exceptionMessage,
    });
  }
}
