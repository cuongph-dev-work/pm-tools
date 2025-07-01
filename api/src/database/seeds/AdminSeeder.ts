import { ADMIN_ROLE, Administrator } from '@entities/administator.entity';
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

export class AdminSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const admin = new Administrator();
    admin.email = 'admin@example.com';
    admin.password = 'Password@123';
    admin.first_name = 'Super';
    admin.last_name = 'Admin';
    admin.role = ADMIN_ROLE.SUPER_ADMIN;

    await em.persistAndFlush(admin);
  }
}
