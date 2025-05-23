import { Administrator } from '@entities/administrator.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { Roles } from '@decorators/role.decorator';
import { ADMIN_ROLE } from '@entities/administator.entity';
import { AdministratorService } from './administrator.service';
import { CreateAdministratorDto } from './dtos/create-administrator.dto';
import { UpdateAdministratorDto } from './dtos/update-administrator.dto';

@Controller('administrators')
@Roles([ADMIN_ROLE.SUPER_ADMIN])
export class AdministratorController {
  constructor(private readonly service: AdministratorService) {}

  @Post()
  async create(
    @Body() createDto: CreateAdministratorDto,
  ): Promise<{ id: string }> {
    return await this.service.create(createDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.service.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Administrator> {
    return await this.service.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAdministratorDto,
  ): Promise<{ id: string }> {
    return await this.service.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.service.delete(id);
  }
}
