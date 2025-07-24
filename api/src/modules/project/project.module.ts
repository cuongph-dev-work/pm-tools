import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { Project } from '../../database/entities/project.entity';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './project.repository';
import { ProjectService } from './project.service';

@Module({
  imports: [MikroOrmModule.forFeature([Project]), UserModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
  exports: [ProjectService],
})
export class ProjectModule {}
