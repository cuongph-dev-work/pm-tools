import { AuthModule } from './auth/auth.module';
// import { FileStorageModule } from './file-storage/file-storage.module';
import { ProjectInviteModule } from './project-invite/project-invite.module';
import { ProjectModule } from './project/project.module';
import { SprintModule } from './sprint/sprint.module';
import { TaskModule } from './task/task.module';

export default [AuthModule, ProjectModule, ProjectInviteModule, SprintModule, TaskModule];
