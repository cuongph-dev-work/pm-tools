import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateSprintDto, SearchSprintDto } from './dtos';
import { SprintService } from './sprint.service';

@Controller('projects/:projectId/sprints')
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @Post()
  async createSprint(
    @Param('projectId') projectId: string,
    @Body() createSprintDto: CreateSprintDto,
  ) {
    return this.sprintService.createSprint(projectId, createSprintDto);
  }

  @Get()
  async findAllSprints(@Param('projectId') projectId: string, @Query() searchDto: SearchSprintDto) {
    return this.sprintService.findAllSprints(projectId, searchDto);
  }

  @Get(':id')
  async findSprintById(@Param('projectId') projectId: string, @Param('id') id: string) {
    return this.sprintService.findSprintById(projectId, id);
  }

  @Patch(':id/close')
  async closeSprint(@Param('projectId') projectId: string, @Param('id') id: string) {
    return this.sprintService.closeSprint(projectId, id);
  }

  @Patch(':id/open')
  async openSprint(@Param('projectId') projectId: string, @Param('id') id: string) {
    return this.sprintService.openSprint(projectId, id);
  }
}
