import { USER_ROLE } from '@configs/enum/db';
import { CurrentUser } from '@decorators/current-user.decorator';
import { Roles } from '@decorators/role.decorator';
import { User } from '@entities/user.entity';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { Cache, CacheInvalidate } from '@shared/modules/cache/cache.decorator';
import { CacheService } from '@shared/modules/cache/cache.service';
import { CreateProjectDto, SearchProjectDto, UpdateProjectDto } from './dtos';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly cacheService: CacheService,
  ) {}

  @Roles([USER_ROLE.ADMIN, USER_ROLE.PM])
  @Post('/')
  createProject(@Body() body: CreateProjectDto, @CurrentUser() currentUser: User) {
    return this.projectService.createProject(body, currentUser);
  }

  @Roles([])
  @Get('/')
  @Cache('project:{0}', { ttl: 1800 }) // Cache for 30 minutes
  getProjects(@Query() query: SearchProjectDto, @CurrentUser() currentUser: User) {
    return this.projectService.findProjects(query, currentUser);
  }

  @Roles([])
  @Get('/member-of')
  getProjectsIMemberOf(@CurrentUser() currentUser: User) {
    return this.projectService.findProjectsIMemberOf(currentUser);
  }

  @Roles([])
  @Get('/:id/members')
  @Cache('project-members:{0}:{1}', { ttl: 1800 }) // Cache for 30 minutes
  getProjectMembers(@Param('id') id: string, @Query('keyword') keyword: string, @CurrentUser() currentUser: User) {
    return this.projectService.getProjectMembers(id, currentUser, keyword);
  }

  @Roles([])
  @Get('/:id/stats')
  @Cache('project-stats:{0}:{1}', { ttl: 3600 }) // Cache for 1 hour
  getProjectStats(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.projectService.getProjectStats(id, currentUser);
  }

  @Roles([])
  @Get('/:id')
  @Cache('project:{0}', { ttl: 1800 }) // Cache for 30 minutes
  getProjectById(@Param('id') id: string) {
    return this.projectService.findProjectById(id);
  }

  @Roles([])
  @Patch('/:id')
  @CacheInvalidate('project:{0}') // Invalidate project cache when updated
  updateProject(@Param('id') id: string, @Body() body: UpdateProjectDto, @CurrentUser() currentUser: User) {
    return this.projectService.updateProject(id, body, currentUser);
  }

  @Roles([])
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  @CacheInvalidate('project:{0}') // Invalidate project cache when deleted
  deleteProject(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.projectService.deleteProject(id, currentUser);
  }
}
