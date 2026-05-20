import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';
    let error = 'Database Error';

    if (exception.code === 'P2002') {
      status = HttpStatus.CONFLICT;
      message = `El registro con ese valor ya existe`;
      error = 'Conflict';
    } else if (exception.code === 'P2025') {
      status = HttpStatus.NOT_FOUND;
      message = `El registro no existe`;
      error = 'Not Found';
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
    });
  }
}
