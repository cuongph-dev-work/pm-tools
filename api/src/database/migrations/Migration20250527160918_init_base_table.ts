import { Migration } from '@mikro-orm/migrations';

export class Migration20250527160918_init_base_table extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "administrator" ("id" varchar not null, "created_by" varchar(20) null, "updated_by" varchar(20) null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "email" varchar(255) not null, "password" varchar(255) not null, "reset_token" varchar(255) null, "reset_token_expired_at" timestamp with time zone null, "avatar_id" varchar(20) null, "first_name" varchar(255) null, "last_name" varchar(255) null, "role" text check ("role" in ('SUPER_ADMIN', 'EVENT_MANAGER')) not null default 'EVENT_MANAGER', "block_to" timestamp with time zone null, constraint "administrator_pkey" primary key ("id"));`);
    this.addSql(`alter table "administrator" add constraint "administrator_email_unique" unique ("email");`);

    this.addSql(`create table "event" ("id" varchar not null, "created_by" varchar(20) null, "updated_by" varchar(20) null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "title" varchar(255) not null, "short_description" varchar(255) not null, "long_description" text not null, "event_type" text check ("event_type" in ('speed_dating', 'singles_party', 'virtual_online')) not null, "event_status" text check ("event_status" in ('draft', 'published', 'cancelled', 'completed')) not null default 'draft', "start_datetime" timestamptz not null, "end_datetime" timestamptz not null, "latitude" numeric(10,8) not null, "longitude" numeric(11,8) not null, "city" varchar(255) not null, "short_address" varchar(255) not null, "long_address" text not null, "min_age" int not null, "max_age" int not null, "max_male_participants" int not null, "max_female_participants" int not null, "ticket_price" numeric(10,2) not null, "discount" numeric(5,2) not null default 0, "ticket_price_after_discount" numeric(10,2) not null, constraint "event_pkey" primary key ("id"));`);

    this.addSql(`create table "file_storage_information" ("id" varchar not null, "created_by" varchar(20) null, "updated_by" varchar(20) null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "kind" text check ("kind" in ('DOCUMENT', 'VIDEO', 'IMAGE', 'ARCHIVE', 'AUDIO', 'OTHER')) not null, "url" varchar not null, "original_name" varchar not null, "mime_type" varchar not null, "size" integer not null, "metadata" jsonb null, "driver" text check ("driver" in ('LOCAL', 'CLOUDINARY')) not null, constraint "file_storage_information_pkey" primary key ("id"));`);

    this.addSql(`create table "event_media_entity" ("id" varchar not null, "created_by" varchar(20) null, "updated_by" varchar(20) null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "event_id" varchar not null, "media_id" varchar not null, "caption" varchar(255) null, "display_order" int not null default 0, constraint "event_media_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "notification" ("id" varchar not null, "created_by" varchar(20) null, "updated_by" varchar(20) null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "type" text check ("type" in ('push_notification', 'news')) not null, "title" varchar(255) not null, "description" text null, "image_id" varchar not null, "target_audience" text null, "is_published" boolean not null default false, "published_at" timestamptz null, constraint "notification_pkey" primary key ("id"));`);

    this.addSql(`create table "user" ("id" varchar not null, "created_by" varchar(20) null, "updated_by" varchar(20) null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "email" varchar(255) not null, "password" varchar(255) not null, "reset_token" varchar(255) null, "reset_token_expired_at" timestamp with time zone null, "avatar_id" varchar not null, "first_name" varchar(255) null, "last_name" varchar(255) null, "gender" text check ("gender" in ('MALE', 'FEMALE', 'OTHER')) not null default 'MALE', "phone" varchar(13) null, "bio" text null, "city" varchar(255) null, "address" varchar(500) null, "block_to" timestamp with time zone null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "booking" ("id" varchar not null, "created_by" varchar(20) null, "updated_by" varchar(20) null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "event_id" varchar not null, "user_id" varchar null, "guest_first_name" varchar(100) null, "guest_last_name" varchar(100) null, "guest_email" varchar(255) null, "guest_gender" text check ("guest_gender" in ('MALE', 'FEMALE', 'OTHER')) null, "guest_phone" varchar(20) null, "booking_status" text check ("booking_status" in ('pending', 'confirmed', 'cancelled', 'completed')) not null default 'pending', "ticket_quantity" int not null default 1, "total_amount" numeric(10,2) not null, "payment_method" varchar(50) null, "payment_reference" varchar(255) null, "booking_date" timestamptz not null, "cancelled_at" timestamptz null, "cancellation_reason" text null, "special_requirements" text null, constraint "booking_pkey" primary key ("id"));`);
    this.addSql(`alter table "booking" add constraint "booking_event_id_user_id_unique" unique ("event_id", "user_id");`);

    this.addSql(`create table "user_notification" ("id" varchar not null, "created_by" varchar(20) null, "updated_by" varchar(20) null, "created_at" timestamp with time zone not null, "updated_at" timestamp with time zone not null, "deleted_at" timestamp with time zone null, "notification_id" varchar not null, "user_id" varchar not null, "is_read" boolean not null default false, "read_at" timestamptz null, constraint "user_notification_pkey" primary key ("id"));`);

    this.addSql(`alter table "event_media_entity" add constraint "event_media_entity_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade;`);
    this.addSql(`alter table "event_media_entity" add constraint "event_media_entity_media_id_foreign" foreign key ("media_id") references "file_storage_information" ("id") on update cascade;`);

    this.addSql(`alter table "notification" add constraint "notification_image_id_foreign" foreign key ("image_id") references "file_storage_information" ("id") on update cascade;`);

    this.addSql(`alter table "user" add constraint "user_avatar_id_foreign" foreign key ("avatar_id") references "file_storage_information" ("id") on update cascade;`);

    this.addSql(`alter table "booking" add constraint "booking_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade;`);
    this.addSql(`alter table "booking" add constraint "booking_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "user_notification" add constraint "user_notification_notification_id_foreign" foreign key ("notification_id") references "notification" ("id") on update cascade;`);
    this.addSql(`alter table "user_notification" add constraint "user_notification_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "event_media_entity" drop constraint "event_media_entity_event_id_foreign";`);

    this.addSql(`alter table "booking" drop constraint "booking_event_id_foreign";`);

    this.addSql(`alter table "event_media_entity" drop constraint "event_media_entity_media_id_foreign";`);

    this.addSql(`alter table "notification" drop constraint "notification_image_id_foreign";`);

    this.addSql(`alter table "user" drop constraint "user_avatar_id_foreign";`);

    this.addSql(`alter table "user_notification" drop constraint "user_notification_notification_id_foreign";`);

    this.addSql(`alter table "booking" drop constraint "booking_user_id_foreign";`);

    this.addSql(`alter table "user_notification" drop constraint "user_notification_user_id_foreign";`);

    this.addSql(`drop table if exists "administrator" cascade;`);

    this.addSql(`drop table if exists "event" cascade;`);

    this.addSql(`drop table if exists "file_storage_information" cascade;`);

    this.addSql(`drop table if exists "event_media_entity" cascade;`);

    this.addSql(`drop table if exists "notification" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "booking" cascade;`);

    this.addSql(`drop table if exists "user_notification" cascade;`);
  }

}
