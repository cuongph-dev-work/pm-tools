import { USER_ROLE } from '@configs/enum/db';
import { CurrentUser } from '@decorators/current-user.decorator';
import { Roles } from '@decorators/role.decorator';
import { User } from '@entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProjectDto, SearchProjectDto, UpdateProjectDto } from './dtos';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Roles([USER_ROLE.ADMIN, USER_ROLE.PM])
  @Post('/')
  createProject(@Body() body: CreateProjectDto, @CurrentUser() currentUser: User) {
    return this.projectService.createProject(body, currentUser);
  }

  @Roles([USER_ROLE.ADMIN])
  @Get('/')
  getProjects(@Query() query: SearchProjectDto, @CurrentUser() currentUser: User) {
    return this.projectService.findProjects(query, currentUser);
  }

  @Roles([])
  @Get('/my-projects')
  getMyProjects(@CurrentUser() currentUser: User) {
    return this.projectService.findMyProjects(currentUser);
  }

  @Roles([])
  @Get('/member-of')
  getProjectsIMemberOf(@CurrentUser() currentUser: User) {
    return this.projectService.findProjectsIMemberOf(currentUser);
  }

  @Roles([])
  @Get('/active')
  getActiveProjects() {
    return this.projectService.findActiveProjects();
  }

  @Roles([])
  @Get('/:id')
  getProjectById(@Param('id') id: string) {
    return this.projectService.findProjectById(id);
  }

  @Roles([])
  @Get('/:id/stats')
  getProjectStats(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.projectService.getProjectStats(id, currentUser);
  }

  @Roles([])
  @Patch('/:id')
  updateProject(
    @Param('id') id: string,
    @Body() body: UpdateProjectDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.projectService.updateProject(id, body, currentUser);
  }

  @Roles([])
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  deleteProject(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.projectService.deleteProject(id, currentUser);
  }
}
