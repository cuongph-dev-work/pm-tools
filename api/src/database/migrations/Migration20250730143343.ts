import { Migration } from '@mikro-orm/migrations';

export class Migration20250730143343 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "git_alert_recipient" ("id" varchar not null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "alert_id" varchar not null, "recipient_id" varchar not null, "status" text check ("status" in ('UNREAD', 'READ', 'ARCHIVED')) not null default 'UNREAD', "read_at" timestamp with time zone null, constraint "git_alert_recipient_pkey" primary key ("id"));`);

    this.addSql(`alter table "git_alert_recipient" add constraint "git_alert_recipient_alert_id_foreign" foreign key ("alert_id") references "git_alert" ("id") on update cascade;`);
    this.addSql(`alter table "git_alert_recipient" add constraint "git_alert_recipient_recipient_id_foreign" foreign key ("recipient_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "git_alert" drop constraint "git_alert_read_by_id_foreign";`);
    this.addSql(`alter table "git_alert" drop constraint "git_alert_triggered_by_id_foreign";`);

    this.addSql(`alter table "git_alert" drop column "read_at", drop column "read_by_id", drop column "triggered_by_id", drop column "is_actionable", drop column "action_required";`);

    this.addSql(`alter table "git_alert" add column "tags" text[] null default '{}';`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "git_alert_recipient" cascade;`);

    this.addSql(`alter table "git_alert" drop column "tags";`);

    this.addSql(`alter table "git_alert" add column "read_at" timestamp with time zone null, add column "read_by_id" varchar null, add column "triggered_by_id" varchar null, add column "is_actionable" boolean not null default false, add column "action_required" varchar(255) null;`);
    this.addSql(`alter table "git_alert" add constraint "git_alert_read_by_id_foreign" foreign key ("read_by_id") references "user" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "git_alert" add constraint "git_alert_triggered_by_id_foreign" foreign key ("triggered_by_id") references "user" ("id") on update cascade on delete set null;`);
  }

}
