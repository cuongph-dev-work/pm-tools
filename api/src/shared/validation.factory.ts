import { UnprocessableEntityException, ValidationError } from '@nestjs/common';

type ErrorMessage = {
  path: string[] | string;
  messages: string[];
};

export const ValidationErrorFactory = (errors: ValidationError[]) => {
  errors.flatMap(error => formatError(error, []));

  throw new UnprocessableEntityException(errors);
};

function formatError(error: ValidationError, parent: string[] | string): ErrorMessage[] {
  const path = [...parent, error.property];
  const messages = Object.values(error.constraints ?? {});
  const newPath = path.join('.');

  return [...(messages.length > 0 ? [{ path: newPath, messages }] : []), ...(error.children ? error.children.flatMap(child => formatError(child, path)) : [])];
}
