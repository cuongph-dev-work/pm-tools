import { Migration } from '@mikro-orm/migrations';

export class Migration20250724044217 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "event_media_entity" drop constraint "event_media_entity_event_id_foreign";`,
    );

    this.addSql(`alter table "booking" drop constraint "booking_event_id_foreign";`);

    this.addSql(
      `alter table "user_notification" drop constraint "user_notification_notification_id_foreign";`,
    );

    this.addSql(
      `create table "project" ("id" varchar not null, "created_by" varchar(20) null, "updated_by" varchar(20) null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "name" varchar(255) not null, "description" text null, "owner_id" varchar not null, "status" text check ("status" in ('ACTIVE', 'INACTIVE', 'COMPLETED', 'CANCELLED')) not null default 'ACTIVE', "tags" varchar(255) null, "start_date" timestamp with time zone null, "end_date" timestamp with time zone null, constraint "project_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "project_member" ("id" varchar not null, "created_by" varchar(20) null, "updated_by" varchar(20) null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "project_id" varchar not null, "user_id" varchar not null, "role" text check ("role" in ('PROJECT_MANAGER', 'DEVELOPER', 'QUALITY_ASSURANCE', 'QUALITY_CONTROL', 'BRSE_COMTOR')) not null, "status" text check ("status" in ('ACTIVE', 'INACTIVE', 'LEFT')) not null default 'ACTIVE', "joined_at" timestamp with time zone not null, "left_at" timestamp with time zone null, constraint "project_member_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "project_member" add constraint "project_member_project_id_user_id_unique" unique ("project_id", "user_id");`,
    );

    this.addSql(
      `create table "project_invite_member" ("id" varchar not null, "created_by" varchar(20) null, "updated_by" varchar(20) null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "project_id" varchar not null, "invited_by_id" varchar not null, "invited_email" varchar(255) not null, "role" text check ("role" in ('PROJECT_MANAGER', 'DEVELOPER', 'QUALITY_ASSURANCE', 'QUALITY_CONTROL', 'BRSE_COMTOR')) not null, "token" varchar(255) not null, "status" text check ("status" in ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED')) not null default 'PENDING', "expired_at" timestamp with time zone not null, "accepted_at" timestamp with time zone null, "rejected_at" timestamp with time zone null, "message" text null, constraint "project_invite_member_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "project_invite_member" add constraint "project_invite_member_token_unique" unique ("token");`,
    );
    this.addSql(
      `alter table "project_invite_member" add constraint "project_invite_member_project_id_invited_email_unique" unique ("project_id", "invited_email");`,
    );

    this.addSql(
      `alter table "project" add constraint "project_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "project_member" add constraint "project_member_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "project_member" add constraint "project_member_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "project_invite_member" add constraint "project_invite_member_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "project_invite_member" add constraint "project_invite_member_invited_by_id_foreign" foreign key ("invited_by_id") references "user" ("id") on update cascade;`,
    );

    this.addSql(`drop table if exists "event" cascade;`);

    this.addSql(`drop table if exists "event_media_entity" cascade;`);

    this.addSql(`drop table if exists "notification" cascade;`);

    this.addSql(`drop table if exists "booking" cascade;`);

    this.addSql(`drop table if exists "user_notification" cascade;`);

    this.addSql(
      `alter table "user" add column "role" text check ("role" in ('OWNER', 'PROJECT_MANAGER', 'DEVELOPER', 'QUALITY_ASSURANCE', 'QUALITY_CONTROL', 'BRSE_COMTOR')) not null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "project_member" drop constraint "project_member_project_id_foreign";`,
    );

    this.addSql(
      `alter table "project_invite_member" drop constraint "project_invite_member_project_id_foreign";`,
    );

    this.addSql(
      `create table "event" ("id" varchar not null, "created_by" varchar(20) null, "updated_by" varchar(20) null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "title" varchar(255) not null, "short_description" varchar(255) not null, "long_description" text not null, "event_type" text check ("event_type" in ('speed_dating', 'singles_party', 'virtual_online')) not null, "event_status" text check ("event_status" in ('draft', 'published', 'cancelled', 'completed')) not null default 'draft', "start_datetime" timestamptz not null, "end_datetime" timestamptz not null, "latitude" numeric(10,8) not null, "longitude" numeric(11,8) not null, "city" varchar(255) not null, "short_address" varchar(255) not null, "long_address" text not null, "min_age" int not null, "max_age" int not null, "max_male_participants" int not null, "max_female_participants" int not null, "ticket_price" numeric(10,2) not null, "discount" numeric(5,2) not null default 0, "ticket_price_after_discount" numeric(10,2) not null, constraint "event_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "event_media_entity" ("id" varchar not null, "created_by" varchar(20) null, "updated_by" varchar(20) null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "event_id" varchar not null, "media_id" varchar not null, "caption" varchar(255) null, "display_order" int not null default 0, constraint "event_media_entity_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "notification" ("id" varchar not null, "created_by" varchar(20) null, "updated_by" varchar(20) null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "type" text check ("type" in ('push_notification', 'news')) not null, "title" varchar(255) not null, "description" text null, "image_id" varchar not null, "target_audience" text null, "is_published" boolean not null default false, "published_at" timestamptz null, constraint "notification_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "booking" ("id" varchar not null, "created_by" varchar(20) null, "updated_by" varchar(20) null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "event_id" varchar not null, "user_id" varchar null, "guest_first_name" varchar(100) null, "guest_last_name" varchar(100) null, "guest_email" varchar(255) null, "guest_gender" text check ("guest_gender" in ('MALE', 'FEMALE', 'OTHER')) null, "guest_phone" varchar(20) null, "booking_status" text check ("booking_status" in ('pending', 'confirmed', 'cancelled', 'completed')) not null default 'pending', "ticket_quantity" int not null default 1, "total_amount" numeric(10,2) not null, "payment_method" varchar(50) null, "payment_reference" varchar(255) null, "booking_date" timestamptz not null, "cancelled_at" timestamptz null, "cancellation_reason" text null, "special_requirements" text null, constraint "booking_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "booking" add constraint "booking_event_id_user_id_unique" unique ("event_id", "user_id");`,
    );

    this.addSql(
      `create table "user_notification" ("id" varchar not null, "created_by" varchar(20) null, "updated_by" varchar(20) null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "notification_id" varchar not null, "user_id" varchar not null, "is_read" boolean not null default false, "read_at" timestamptz null, constraint "user_notification_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "event_media_entity" add constraint "event_media_entity_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "event_media_entity" add constraint "event_media_entity_media_id_foreign" foreign key ("media_id") references "file_storage_information" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "notification" add constraint "notification_image_id_foreign" foreign key ("image_id") references "file_storage_information" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "booking" add constraint "booking_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "booking" add constraint "booking_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`,
    );

    this.addSql(
      `alter table "user_notification" add constraint "user_notification_notification_id_foreign" foreign key ("notification_id") references "notification" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "user_notification" add constraint "user_notification_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
    );

    this.addSql(`drop table if exists "project" cascade;`);

    this.addSql(`drop table if exists "project_member" cascade;`);

    this.addSql(`drop table if exists "project_invite_member" cascade;`);

    this.addSql(`alter table "user" drop column "role";`);
  }
}
