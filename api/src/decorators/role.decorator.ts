import { USER_ROLE } from '@entities/user.entity';
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<USER_ROLE[]>();
