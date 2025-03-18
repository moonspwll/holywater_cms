import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

/**
 * A filter that catches `HttpException` and transforms it for GraphQL responses.
 * 
 * @class
 * @implements {ExceptionFilter}
 * 
 * @method catch
 * @param {HttpException} exception - The exception thrown.
 * @param {ArgumentsHost} host - The host object containing arguments for the current request.
 * 
 * @throws {HttpException} - Throws the modified exception with additional GraphQL extensions.
 */
@Catch(HttpException)
export class GqlHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message = typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse['message'];

    exception.message = message;
    exception['extensions'] = {
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: status,
    };

    throw exception;
  }
}