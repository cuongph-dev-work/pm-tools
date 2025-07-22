import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Request } from 'express';

@Injectable()
export class RequestContextService {
  private readonly storage = new AsyncLocalStorage<Request>();

  run(req: Request, fn: () => void) {
    this.storage.run(req, fn);
  }

  getRequest(): Request | undefined {
    return this.storage.getStore();
  }
}
