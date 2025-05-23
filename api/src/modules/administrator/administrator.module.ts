import { Administrator } from '@entities/administator.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AdministratorController } from './administrator.controller';
import { AdministratorRepository } from './administrator.repository';
import { AdministratorService } from './administrator.service';

@Module({
  imports: [MikroOrmModule.forFeature([Administrator])],
  controllers: [AdministratorController],
  providers: [AdministratorService, AdministratorRepository],
  exports: [AdministratorService],
})
export class AdministratorModule {}
