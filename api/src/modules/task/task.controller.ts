import { CurrentUser } from '@decorators/current-user.decorator';
import { User } from '@entities/user.entity';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { CreateTaskDto, SearchTaskInSprintDto, UpdateTaskDto } from './dtos';
import { TaskService } from './task.service';

@Controller('projects/:projectId/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(
    @Param('projectId') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.taskService.createTask(projectId, createTaskDto, currentUser);
  }

  @Put(':taskId')
  async updateTask(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.taskService.updateTask(projectId, taskId, updateTaskDto, currentUser);
  }

  @Get('backlog')
  async getTaskFromBacklog(
    @Param('projectId') projectId: string,
    @Query() searchDto: SearchTaskInSprintDto,
  ) {
    return this.taskService.getTaskFromBacklog(projectId, searchDto);
  }

  @Get(':id')
  async findTaskById(@Param('projectId') projectId: string, @Param('id') id: string) {
    return this.taskService.findTaskById(projectId, id);
  }

  @Delete(':id')
  async deleteTask(@Param('projectId') projectId: string, @Param('id') id: string) {
    return this.taskService.deleteTask(projectId, id);
  }

  @Get('sprint/:sprintId')
  async getTaskFromSprint(
    @Param('projectId') projectId: string,
    @Param('sprintId') sprintId: string,
    @Query() searchDto: SearchTaskInSprintDto,
  ) {
    return this.taskService.getTaskFromSprint(projectId, sprintId, searchDto);
  }

  @Patch(':id/sprint/:sprintId')
  async addTaskToSprint(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Param('sprintId') sprintId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.taskService.addTaskToSprint(projectId, id, sprintId, currentUser);
  }

  @Patch(':id/move-to-backlog')
  async moveTaskToBacklog(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.taskService.moveTaskToBacklog(projectId, id, currentUser);
  }
}
