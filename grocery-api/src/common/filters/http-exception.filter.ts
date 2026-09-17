import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();

    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : null;

    let message: string | string[] = 'Internal server error';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const responseMessage = (
        exceptionResponse as { message?: string | string[] }
      ).message;

      if (responseMessage) {
        message = responseMessage;
      }
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error: this.getErrorName(status),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }

  private getErrorName(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';

      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';

      case HttpStatus.FORBIDDEN:
        return 'Forbidden';

      case HttpStatus.NOT_FOUND:
        return 'Not Found';

      case HttpStatus.CONFLICT:
        return 'Conflict';

      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'Unprocessable Entity';

      default:
        return status >= 500 ? 'Internal Server Error' : 'Error';
    }
  }
}