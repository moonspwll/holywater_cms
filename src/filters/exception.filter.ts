import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch(HttpException)
export class GqlHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Отримуємо повідомлення про помилку
    const message = typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse['message'];

    // Повертаємо помилку у форматі GraphQL
    exception.message = message; // Оновлюємо повідомлення
    exception['extensions'] = {
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: status,
    };

    throw exception; // GraphQL автоматично обробить цю помилку
  }
}