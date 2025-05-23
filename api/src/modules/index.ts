import { AdministratorModule } from './administrator/administrator.module';
import { AuthModule } from './auth/auth.module';
import { FileStorageModule } from './file-storage/file-storage.module';
import { UserModule } from './user/user.module';

export default [UserModule, AuthModule, FileStorageModule, AdministratorModule];
