import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class PerformanceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req['_startTime'] = Date.now();
    // req['_memoryStart'] = process.memoryUsage().heapUsed;
    req['_queryStats'] = [];

    next();
  }
}
