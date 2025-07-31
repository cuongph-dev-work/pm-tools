import { Migration } from '@mikro-orm/migrations';

export class Migration20250731090110 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "git_alert" add column "bug_review_created" boolean null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "git_alert" drop column "bug_review_created";`);
  }

}
