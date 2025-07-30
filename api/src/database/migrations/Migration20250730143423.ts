import { Migration } from '@mikro-orm/migrations';

export class Migration20250730143423 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "git_alert" drop column "status";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "git_alert" add column "status" text check ("status" in ('UNREAD', 'READ', 'ARCHIVED')) not null default 'UNREAD';`);
  }

}
