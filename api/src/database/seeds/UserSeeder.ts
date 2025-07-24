import { USER_ROLE } from '@configs/enum/db';
import { User } from '@entities/user.entity';
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

const users = [
  {
    email: 'admin@example.com',
    password: 'Password@123',
    first_name: 'Admin',
    last_name: 'Admin',
    role: USER_ROLE.ADMIN,
  },
  {
    email: 'pm@example.com',
    password: 'Password@123',
    first_name: 'Project',
    last_name: 'Manager',
    role: USER_ROLE.PM,
  },
];

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (const user of users) {
      const userEntity = new User();
      userEntity.email = user.email;
      userEntity.password = user.password;
      userEntity.first_name = user.first_name;
      userEntity.last_name = user.last_name;
      userEntity.role = user.role;
      await em.persistAndFlush(userEntity);
    }
  }
}
