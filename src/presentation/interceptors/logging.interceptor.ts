
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as winston from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: winston.Logger) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const { method, url, body } = request;

        const traceId = uuidv4();
        request.headers['x-trace-id'] = traceId;

        const now = Date.now();
        const safeBody = { ...body };
        if (safeBody.password) safeBody.password = '***';
        if (safeBody.refreshToken) safeBody.refreshToken = '***'; // Mask refresh token too

        this.logger.info(`Incoming Request: ${method} ${url}`, {
            traceId,
            body: safeBody,
            context: 'HTTP',
        });

        return next.handle().pipe(
            tap((data) => {
                const delay = Date.now() - now;
                this.logger.info(`Response: ${method} ${url} ${response.statusCode} - ${delay}ms`, {
                    traceId,
                    statusCode: response.statusCode,
                    delay,
                    context: 'HTTP',
                });
            }),
        );
    }
}
