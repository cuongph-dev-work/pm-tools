import { FILE_KIND, STORAGE_DRIVER } from '@configs/enum/file';
import { Entity, Enum, Filter, Opt, Property } from '@mikro-orm/core';
import { AuditableEntity } from './auditable.abstract';

/**
 * FileStorage entity representing the file_storage_information table in the database
 * Stores information about uploaded files
 */
@Entity({ tableName: 'file_storage_information' })
@Filter({ name: 'isActive', cond: { deleted_at: null } })
export class FileStorage extends AuditableEntity {
  /**
   * Type/kind of the file (DOCUMENT | VIDEO | IMAGE)
   */
  @Enum({ items: () => FILE_KIND })
  kind!: FILE_KIND;

  /**
   * URL where the file is stored
   */
  @Property({ columnType: 'varchar' })
  url!: string;

  /**
   * Original name of the file
   */
  @Property({ columnType: 'varchar' })
  original_name!: string;

  /**
   * MIME type of the file
   */
  @Property({ columnType: 'varchar' })
  mime_type!: string;

  /**
   * Size of the file in bytes
   */
  @Property({ columnType: 'integer' })
  size!: number;

  /**
   * Metadata of the file
   */
  @Property({ columnType: 'jsonb', nullable: true })
  metadata?: Opt<Record<string, any>>;

  /**
   * Drive ID of the file
   */
  @Enum({ items: () => STORAGE_DRIVER })
  driver!: STORAGE_DRIVER;
}
