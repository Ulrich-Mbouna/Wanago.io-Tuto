import { BaseExceptionFilter } from '@nestjs/core';
import { Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export default class ExceptionLoggerFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('Exception thrown', exception);
    super.catch(exception, host);
  }
}
