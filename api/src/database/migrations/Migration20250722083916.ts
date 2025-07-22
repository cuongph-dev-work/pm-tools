import { Migration } from '@mikro-orm/migrations';

export class Migration20250722083916 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "event_media_entity" drop constraint "event_media_entity_event_id_foreign";`);
    this.addSql(`alter table "event_media_entity" drop constraint "event_media_entity_media_id_foreign";`);

    this.addSql(`alter table "notification" drop constraint "notification_image_id_foreign";`);

    this.addSql(`alter table "user" drop constraint "user_avatar_id_foreign";`);

    this.addSql(`alter table "booking" drop constraint "booking_event_id_foreign";`);
    this.addSql(`alter table "booking" drop constraint "booking_user_id_foreign";`);

    this.addSql(`alter table "user_notification" drop constraint "user_notification_notification_id_foreign";`);
    this.addSql(`alter table "user_notification" drop constraint "user_notification_user_id_foreign";`);

    this.addSql(`alter table "administrator" alter column "id" type varchar using ("id"::varchar);`);

    this.addSql(`alter table "event" alter column "id" type varchar using ("id"::varchar);`);

    this.addSql(`alter table "file_storage_information" alter column "id" type varchar using ("id"::varchar);`);

    this.addSql(`alter table "event_media_entity" alter column "id" type varchar using ("id"::varchar);`);
    this.addSql(`alter table "event_media_entity" alter column "event_id" type varchar using ("event_id"::varchar);`);
    this.addSql(`alter table "event_media_entity" alter column "media_id" type varchar using ("media_id"::varchar);`);
    this.addSql(`alter table "event_media_entity" add constraint "event_media_entity_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade;`);
    this.addSql(`alter table "event_media_entity" add constraint "event_media_entity_media_id_foreign" foreign key ("media_id") references "file_storage_information" ("id") on update cascade;`);

    this.addSql(`alter table "notification" alter column "id" type varchar using ("id"::varchar);`);
    this.addSql(`alter table "notification" alter column "image_id" type varchar using ("image_id"::varchar);`);
    this.addSql(`alter table "notification" add constraint "notification_image_id_foreign" foreign key ("image_id") references "file_storage_information" ("id") on update cascade;`);

    this.addSql(`alter table "user" alter column "id" type varchar using ("id"::varchar);`);
    this.addSql(`alter table "user" alter column "avatar_id" type varchar using ("avatar_id"::varchar);`);
    this.addSql(`alter table "user" alter column "avatar_id" drop not null;`);
    this.addSql(`alter table "user" add constraint "user_avatar_id_foreign" foreign key ("avatar_id") references "file_storage_information" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "booking" alter column "id" type varchar using ("id"::varchar);`);
    this.addSql(`alter table "booking" alter column "event_id" type varchar using ("event_id"::varchar);`);
    this.addSql(`alter table "booking" alter column "user_id" type varchar using ("user_id"::varchar);`);
    this.addSql(`alter table "booking" add constraint "booking_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade;`);
    this.addSql(`alter table "booking" add constraint "booking_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "user_notification" alter column "id" type varchar using ("id"::varchar);`);
    this.addSql(`alter table "user_notification" alter column "notification_id" type varchar using ("notification_id"::varchar);`);
    this.addSql(`alter table "user_notification" alter column "user_id" type varchar using ("user_id"::varchar);`);
    this.addSql(`alter table "user_notification" add constraint "user_notification_notification_id_foreign" foreign key ("notification_id") references "notification" ("id") on update cascade;`);
    this.addSql(`alter table "user_notification" add constraint "user_notification_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "booking" drop constraint "booking_event_id_foreign";`);
    this.addSql(`alter table "booking" drop constraint "booking_user_id_foreign";`);

    this.addSql(`alter table "event_media_entity" drop constraint "event_media_entity_event_id_foreign";`);
    this.addSql(`alter table "event_media_entity" drop constraint "event_media_entity_media_id_foreign";`);

    this.addSql(`alter table "notification" drop constraint "notification_image_id_foreign";`);

    this.addSql(`alter table "user" drop constraint "user_avatar_id_foreign";`);

    this.addSql(`alter table "user_notification" drop constraint "user_notification_notification_id_foreign";`);
    this.addSql(`alter table "user_notification" drop constraint "user_notification_user_id_foreign";`);

    this.addSql(`alter table "administrator" alter column "id" type varchar using ("id"::varchar);`);

    this.addSql(`alter table "booking" alter column "id" type varchar using ("id"::varchar);`);
    this.addSql(`alter table "booking" alter column "event_id" type varchar using ("event_id"::varchar);`);
    this.addSql(`alter table "booking" alter column "user_id" type varchar using ("user_id"::varchar);`);
    this.addSql(`alter table "booking" add constraint "booking_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade on delete no action;`);
    this.addSql(`alter table "booking" add constraint "booking_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "event" alter column "id" type varchar using ("id"::varchar);`);

    this.addSql(`alter table "event_media_entity" alter column "id" type varchar using ("id"::varchar);`);
    this.addSql(`alter table "event_media_entity" alter column "event_id" type varchar using ("event_id"::varchar);`);
    this.addSql(`alter table "event_media_entity" alter column "media_id" type varchar using ("media_id"::varchar);`);
    this.addSql(`alter table "event_media_entity" add constraint "event_media_entity_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade on delete no action;`);
    this.addSql(`alter table "event_media_entity" add constraint "event_media_entity_media_id_foreign" foreign key ("media_id") references "file_storage_information" ("id") on update cascade on delete no action;`);

    this.addSql(`alter table "file_storage_information" alter column "id" type varchar using ("id"::varchar);`);

    this.addSql(`alter table "notification" alter column "id" type varchar using ("id"::varchar);`);
    this.addSql(`alter table "notification" alter column "image_id" type varchar using ("image_id"::varchar);`);
    this.addSql(`alter table "notification" add constraint "notification_image_id_foreign" foreign key ("image_id") references "file_storage_information" ("id") on update cascade on delete no action;`);

    this.addSql(`alter table "user" alter column "id" type varchar using ("id"::varchar);`);
    this.addSql(`alter table "user" alter column "avatar_id" type varchar using ("avatar_id"::varchar);`);
    this.addSql(`alter table "user" alter column "avatar_id" set not null;`);
    this.addSql(`alter table "user" add constraint "user_avatar_id_foreign" foreign key ("avatar_id") references "file_storage_information" ("id") on update cascade on delete no action;`);

    this.addSql(`alter table "user_notification" alter column "id" type varchar using ("id"::varchar);`);
    this.addSql(`alter table "user_notification" alter column "notification_id" type varchar using ("notification_id"::varchar);`);
    this.addSql(`alter table "user_notification" alter column "user_id" type varchar using ("user_id"::varchar);`);
    this.addSql(`alter table "user_notification" add constraint "user_notification_notification_id_foreign" foreign key ("notification_id") references "notification" ("id") on update cascade on delete no action;`);
    this.addSql(`alter table "user_notification" add constraint "user_notification_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete no action;`);
  }

}
