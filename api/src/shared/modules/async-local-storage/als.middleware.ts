import { Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AlsMiddleware implements NestMiddleware {
  constructor(private readonly als: AsyncLocalStorage<Request>) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.als.run(req, () => {
      next();
    });
  }
}
