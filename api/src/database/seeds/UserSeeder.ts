import { User } from '@entities/user.entity';
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const user = new User();
    user.email = 'user@example.com';
    user.password = 'Password@123';
    user.first_name = 'User';
    user.last_name = 'User';

    await em.persistAndFlush(user);
  }
}
