import { Migration } from '@mikro-orm/migrations';

export class Migration20250724111236 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" varchar not null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "email" varchar(255) not null, "password" varchar(255) not null, "reset_token" varchar(255) null, "reset_token_expired_at" timestamp with time zone null, "avatar_id" varchar null, "first_name" varchar(255) null, "last_name" varchar(255) null, "phone" varchar(13) null, "bio" text null, "city" varchar(255) null, "address" varchar(500) null, "block_to" timestamp with time zone null, "role" text check ("role" in ('ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'QUALITY_ASSURANCE', 'QUALITY_CONTROL', 'BRSE_COMTOR')) not null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "project" ("id" varchar not null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "name" varchar(255) not null, "description" text null, "owner_id" varchar not null, "status" text check ("status" in ('ACTIVE', 'INACTIVE', 'COMPLETED', 'CANCELLED')) not null default 'ACTIVE', "tags" varchar(255) null, "start_date" timestamp with time zone null, "end_date" timestamp with time zone null, constraint "project_pkey" primary key ("id"));`);

    this.addSql(`create table "project_member" ("id" varchar not null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "project_id" varchar not null, "user_id" varchar not null, "role" text check ("role" in ('PROJECT_MANAGER', 'DEVELOPER', 'QUALITY_ASSURANCE', 'QUALITY_CONTROL', 'BRSE_COMTOR')) not null, "status" text check ("status" in ('ACTIVE', 'INACTIVE', 'LEFT')) not null default 'ACTIVE', "joined_at" timestamp with time zone not null, "left_at" timestamp with time zone null, constraint "project_member_pkey" primary key ("id"));`);
    this.addSql(`alter table "project_member" add constraint "project_member_project_id_user_id_unique" unique ("project_id", "user_id");`);

    this.addSql(`create table "project_invite_member" ("id" varchar not null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "project_id" varchar not null, "invited_by_id" varchar not null, "invited_email" varchar(255) not null, "role" text check ("role" in ('PROJECT_MANAGER', 'DEVELOPER', 'QUALITY_ASSURANCE', 'QUALITY_CONTROL', 'BRSE_COMTOR')) not null, "token" varchar(255) not null, "status" text check ("status" in ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED')) not null default 'PENDING', "expired_at" timestamp with time zone not null, "accepted_at" timestamp with time zone null, "rejected_at" timestamp with time zone null, "message" text null, constraint "project_invite_member_pkey" primary key ("id"));`);
    this.addSql(`alter table "project_invite_member" add constraint "project_invite_member_token_unique" unique ("token");`);
    this.addSql(`alter table "project_invite_member" add constraint "project_invite_member_project_id_invited_email_unique" unique ("project_id", "invited_email");`);

    this.addSql(`create table "file_storage_information" ("id" varchar not null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "created_by_id" varchar null, "updated_by_id" varchar null, "kind" text check ("kind" in ('DOCUMENT', 'VIDEO', 'IMAGE', 'ARCHIVE', 'AUDIO', 'OTHER')) not null, "url" varchar not null, "original_name" varchar not null, "mime_type" varchar not null, "size" integer not null, "metadata" jsonb null, "driver" text check ("driver" in ('LOCAL', 'CLOUDINARY')) not null, constraint "file_storage_information_pkey" primary key ("id"));`);

    this.addSql(`alter table "user" add constraint "user_avatar_id_foreign" foreign key ("avatar_id") references "file_storage_information" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "project" add constraint "project_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "project_member" add constraint "project_member_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`);
    this.addSql(`alter table "project_member" add constraint "project_member_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "project_invite_member" add constraint "project_invite_member_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`);
    this.addSql(`alter table "project_invite_member" add constraint "project_invite_member_invited_by_id_foreign" foreign key ("invited_by_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "file_storage_information" add constraint "file_storage_information_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "file_storage_information" add constraint "file_storage_information_updated_by_id_foreign" foreign key ("updated_by_id") references "user" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "project" drop constraint "project_owner_id_foreign";`);

    this.addSql(`alter table "project_member" drop constraint "project_member_user_id_foreign";`);

    this.addSql(`alter table "project_invite_member" drop constraint "project_invite_member_invited_by_id_foreign";`);

    this.addSql(`alter table "file_storage_information" drop constraint "file_storage_information_created_by_id_foreign";`);

    this.addSql(`alter table "file_storage_information" drop constraint "file_storage_information_updated_by_id_foreign";`);

    this.addSql(`alter table "project_member" drop constraint "project_member_project_id_foreign";`);

    this.addSql(`alter table "project_invite_member" drop constraint "project_invite_member_project_id_foreign";`);

    this.addSql(`alter table "user" drop constraint "user_avatar_id_foreign";`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "project" cascade;`);

    this.addSql(`drop table if exists "project_member" cascade;`);

    this.addSql(`drop table if exists "project_invite_member" cascade;`);

    this.addSql(`drop table if exists "file_storage_information" cascade;`);
  }

}
