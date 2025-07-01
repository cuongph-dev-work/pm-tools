import { Reflector } from '@nestjs/core';

export enum ROLE {
  SUPER_ADMIN = 'SUPER_ADMIN',
  EVENT_MANAGER = 'EVENT_MANAGER',
  USER = 'USER',
}

export const Roles = Reflector.createDecorator<ROLE[]>();
