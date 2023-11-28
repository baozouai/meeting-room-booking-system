import { Request, Response } from 'express';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  logger = new Logger(InvokeRecordInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getRequest();

    const userAgent = request.headers['user-agent'];
    const { ip, method, path } = request;

    const preTip = `${method} ${path} ${ip} ${userAgent}`;
    this.logger.verbose('---------------------------------');
    this.logger.debug(
      `${preTip}: 【${context.getClass().name}】.${context.getHandler().name}`,
    );
    this.logger.debug(
      `user: ${request.user?.username} ${request.user?.userId}`,
    );

    const now = Date.now();
    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(
          `${preTip}: ${response.statusCode}: ${Date.now() - now}ms`,
        );
        this.logger.debug(`Response: ${JSON.stringify(res)}`);
      }),
    );
  }
}
