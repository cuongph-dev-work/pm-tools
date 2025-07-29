import { Migration } from '@mikro-orm/migrations';

export class Migration20250729163029 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "git_repository" ("id" varchar not null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "name" varchar(255) not null, "url" varchar(500) not null, "provider" text check ("provider" in ('GITHUB', 'GITLAB')) not null, "alert_types" text[] null, "cron_time" varchar(255) null default '0 0 * * *', "last_sync_at" timestamp with time zone null, "enable_sync" boolean not null default false, "webhook_secret" varchar(255) null, "project_id" varchar not null, constraint "git_repository_pkey" primary key ("id"));`);

    this.addSql(`create table "git_alert" ("id" varchar not null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "title" varchar(255) not null, "description" text null, "type" text check ("type" in ('MERGED', 'BUILD', 'TEST', 'CONFLICT', 'COMMENTS', 'PULL_REQUEST', 'PUSH', 'DEPLOYMENT')) not null, "status" text check ("status" in ('UNREAD', 'READ', 'ARCHIVED')) not null default 'UNREAD', "priority" text check ("priority" in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) not null default 'MEDIUM', "metadata" jsonb null, "read_at" timestamp with time zone null, "read_by_id" varchar null, "repository_id" varchar not null, "project_id" varchar not null, "triggered_by_id" varchar null, "external_url" varchar(500) null, "is_actionable" boolean not null default false, "action_required" varchar(255) null, constraint "git_alert_pkey" primary key ("id"));`);

    this.addSql(`alter table "git_repository" add constraint "git_repository_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`);

    this.addSql(`alter table "git_alert" add constraint "git_alert_read_by_id_foreign" foreign key ("read_by_id") references "user" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "git_alert" add constraint "git_alert_repository_id_foreign" foreign key ("repository_id") references "git_repository" ("id") on update cascade;`);
    this.addSql(`alter table "git_alert" add constraint "git_alert_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`);
    this.addSql(`alter table "git_alert" add constraint "git_alert_triggered_by_id_foreign" foreign key ("triggered_by_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "user" add column "github_username" varchar(255) null, add column "gitlab_username" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "git_alert" drop constraint "git_alert_repository_id_foreign";`);

    this.addSql(`drop table if exists "git_repository" cascade;`);

    this.addSql(`drop table if exists "git_alert" cascade;`);

    this.addSql(`alter table "user" drop column "github_username", drop column "gitlab_username";`);
  }

}
