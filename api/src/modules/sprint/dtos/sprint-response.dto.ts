import { Exclude, Expose, Transform } from 'class-transformer';

export class TaskResponseDto {
  id: string;

  title: string;

  description?: string;

  type: string;

  status: string;

  priority: string;

  estimate?: number;

  due_date?: string;
}

@Exclude()
export class SprintResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  start_date?: string;

  @Expose()
  end_date?: string;

  @Expose()
  status: string;

  @Expose()
  @Transform(({ obj }) => {
    if (!obj.tasks || !obj.tasks.isInitialized()) {
      return 0;
    }
    return obj.tasks.length;
  })
  task_count?: number;
}

@Exclude()
export class SprintListResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  start_date?: string;

  @Expose()
  end_date?: string;

  @Expose()
  status: string;
}
