import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { ADMIN_ROLE } from '../../configs/enum/user';
import { User } from '../entities/user.entity';

export class AdminSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const user = new User();
    user.email = 'admin@example.com';
    user.password = 'Password@123';
    user.role = ADMIN_ROLE.SUPER_ADMIN;
    user.first_name = 'Super';
    user.last_name = 'Admin';

    await em.persistAndFlush(user);
  }
}
