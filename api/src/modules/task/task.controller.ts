import { CurrentUser } from '@decorators/current-user.decorator';
import { User } from '@entities/user.entity';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dtos';
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

  @Get(':id')
  async findTaskById(@Param('projectId') projectId: string, @Param('id') id: string) {
    return this.taskService.findTaskById(projectId, id);
  }

  @Delete(':id')
  async deleteTask(@Param('projectId') projectId: string, @Param('id') id: string) {
    return this.taskService.deleteTask(projectId, id);
  }

  // @Get()
  // async findAllTasks(@Query() searchDto: SearchTaskDto) {
  //   return this.taskService.findAllTasks(searchDto);
  // }

  // @Put(':id')
  // async updateTask(
  //   @Param('id') id: string,
  //   @Body() updateTaskDto: UpdateTaskDto,
  //   @CurrentUser() currentUser: User,
  // ): Promise<TaskResponseDto> {
  //   return this.taskService.updateTask(id, updateTaskDto, currentUser);
  // }

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async deleteTask(@Param('id') id: string): Promise<void> {
  //   return this.taskService.deleteTask(id);
  // }

  // @Get('project/:projectId')
  // async findTasksByProject(@Param('projectId') projectId: string): Promise<TaskResponseDto[]> {
  //   return this.taskService.findTasksByProject(projectId);
  // }

  // @Get('sprint/:sprintId')
  // async findTasksBySprint(@Param('sprintId') sprintId: string): Promise<TaskResponseDto[]> {
  //   return this.taskService.findTasksBySprint(sprintId);
  // }

  // @Get('assignee/:assigneeId')
  // async findTasksByAssignee(@Param('assigneeId') assigneeId: string): Promise<TaskResponseDto[]> {
  //   return this.taskService.findTasksByAssignee(assigneeId);
  // }
}
