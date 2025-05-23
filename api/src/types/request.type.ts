import { Request } from 'express';
import { User } from 'src/database/entities/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}
