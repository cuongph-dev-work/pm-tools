import { PROJECT_ROLE, USER_ROLE } from '@configs/enum/db';
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<USER_ROLE[]>();
export const ProjectRoles = Reflector.createDecorator<PROJECT_ROLE[]>();
