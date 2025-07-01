import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserInfoResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  first_name?: string;

  @Expose()
  middle_name?: string;

  @Expose()
  last_name?: string;

  @Expose()
  phone?: string;

  @Expose()
  avatar_url?: string;

  @Expose()
  @Type(() => Date)
  created_at: Date;

  @Expose()
  @Type(() => Date)
  updated_at: Date;
}
