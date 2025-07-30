import { Migration } from '@mikro-orm/migrations';

export class Migration20250730145914 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "git_repository" drop column "alert_types";`);

    this.addSql(`alter table "git_repository" add column "personal_access_token" varchar(255) null;`);

    this.addSql(`alter table "git_alert_recipient" drop column "status";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "git_repository" drop column "personal_access_token";`);

    this.addSql(`alter table "git_repository" add column "alert_types" text[] null;`);

    this.addSql(`alter table "git_alert_recipient" add column "status" text check ("status" in ('UNREAD', 'READ', 'ARCHIVED')) not null default 'UNREAD';`);
  }

}
