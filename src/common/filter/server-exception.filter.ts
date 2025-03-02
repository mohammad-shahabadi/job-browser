import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class ServerExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ServerExceptionFilter.name);

  constructor() {}

  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseMessage;

    if (status >= 500) {
      responseMessage = 'Something went wrong in the server !';
      this.logger.error(
        `Status: ${status}, Error: ${JSON.stringify(exception.message)}`,
        exception instanceof Error ? exception.stack : '',
      );
    } else {
      responseMessage =
        exception instanceof HttpException
          ? exception.getResponse()['message']
          : 'Something went wrong in the server !';
    }

    // If Multilingual was added replace request.headers['lang']
    // const lang = 'en';

    // const translatedMessage: string | Array<string> = Array.isArray(
    //   responseMessage,
    // )
    //   ? responseMessage
    //   : await this.i18n.translate(responseMessage, { lang });

    response.status(status).json({
      statusCode: status,
      message: responseMessage,
    });
  }
}
