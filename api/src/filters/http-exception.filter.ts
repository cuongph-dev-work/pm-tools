import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { isEmpty } from 'lodash';
import { I18nService } from 'nestjs-i18n';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const lang = host.switchToHttp().getRequest().i18nLang;
    // Determine the status code and message
    const status = exception instanceof HttpException ? (exception.getStatus() as HttpStatus) : HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = exception.message;
    let errors: Partial<Record<string, any>>[] = [];

    if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
      message = this.i18n.t('app.http.unprocessableEntity');
      const resErrors = exception.getResponse().message;
      if (resErrors instanceof Array) {
        errors = this.translateErrors(resErrors, lang);
      }
    } else {
      if (isEmpty(message)) {
        switch (status) {
          case HttpStatus.BAD_REQUEST:
            message = this.i18n.t('app.http.badRequest');
            break;
          case HttpStatus.UNAUTHORIZED:
            message = this.i18n.t('app.http.unauthorized');
            break;
          case HttpStatus.FORBIDDEN:
            message = this.i18n.t('app.http.forbidden');
            break;
          case HttpStatus.NOT_FOUND:
            message = this.i18n.t('app.http.notFound');
            break;
          case HttpStatus.INTERNAL_SERVER_ERROR:
            message = this.i18n.t('app.http.internalServerError');
            break;
        }
      }
    }

    // Log the error with relevant details
    this.logger.error(`lang: ${lang}`, `status: ${status}`, `${request.method} ${request.url}`, exception instanceof Error ? exception.stack : '', HttpExceptionFilter.name);

    // Create a consistent error response structure
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
      ...(errors.length > 0 && { errors }),
      ...(this.configService.get('app.nodeEnv') === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    // Send the error response
    response.status(status).json(errorResponse);
  }

  private processChildren(children): any[] {
    let allConstraints: any[] = [];

    if (Array.isArray(children)) {
      children.forEach(childError => {
        let constraints = childError?.constraints;
        if (constraints) {
          constraints = Object.values(childError?.constraints);
          allConstraints.push({
            property: childError.property,
            constraints,
          });
        }
        if (childError?.children && Array.isArray(childError.children)) {
          allConstraints = allConstraints.concat(this.processChildren(childError.children));
        }
      });
    }

    return allConstraints;
  }

  private translateErrors(errors: ValidationError[], lang: string) {
    return errors.map(error => {
      if (!error.constraints && error.children && Array.isArray(error.children)) {
        const allMessages: { path: string; messages: string }[] = [];
        this.processChildren(error.children).forEach(childMessage => {
          const parsedObj = JSON.parse(childMessage.constraints);
          const key = parsedObj.key;
          const params = parsedObj.params;
          const prefix = parsedObj.prefix;
          const property = this.i18n.t(prefix ? `validation.label.${prefix}.${childMessage.property}` : `validation.label.${childMessage.property}`, {
            lang,
          });
          const constraintValues = Object.values(params);
          allMessages.push({
            path: childMessage.property,
            messages: this.i18n.t(`validation.${key}`, {
              lang,
              args: {
                property,
                constraints: constraintValues,
                ...params,
              },
            }),
          });
        });
        return allMessages;
      } else {
        const stringifiedObj = Object.values(error.constraints ?? {})?.[0];
        const parsedObj = JSON.parse(stringifiedObj);

        const params = parsedObj.params;
        const key = parsedObj.key;
        const prefix = parsedObj.prefix;
        const property = this.i18n.t(prefix ? `validation.label.${prefix}.${error.property}` : `validation.label.${error.property}`, {
          lang,
        });

        if (params.properties) {
          let i = 1;
          for (const p of params.properties) {
            params[`property${i}`] = this.i18n
              .t(`validation.label.${p}`, {
                lang,
              })
              .toLowerCase();
            i++;
          }
        }

        const constraintValues = Object.values(params);
        return {
          path: error.property,
          messages: this.i18n.t(`validation.${key}`, {
            lang,
            args: {
              property,
              constraints: constraintValues,
              ...params,
            },
          }),
        };
      }
    });
  }
}
