import { Migration } from '@mikro-orm/migrations';

export class Migration20250731160723 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "git_alert" drop constraint if exists "git_alert_type_check";`);

    this.addSql(`alter table "git_alert" add constraint "git_alert_type_check" check("type" in ('MERGED', 'BUILD', 'TEST', 'CONFLICT', 'COMMENT', 'PULL_REQUEST', 'PUSH', 'PIPELINE'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "git_alert" drop constraint if exists "git_alert_type_check";`);

    this.addSql(`alter table "git_alert" add constraint "git_alert_type_check" check("type" in ('MERGED', 'BUILD', 'TEST', 'CONFLICT', 'COMMENT', 'PULL_REQUEST', 'PUSH', 'PIPELINE', 'WORKFLOW_RUN'));`);
  }

}
