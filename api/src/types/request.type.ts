import { Request } from 'express';
import { User } from 'src/database/entities/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}

declare module 'express' {
  interface Request {
    _queryStats?: Array<{ query: string; params: unknown[]; time: number }>;
    _startTime?: number;
    _memoryStart?: number;
  }
}
