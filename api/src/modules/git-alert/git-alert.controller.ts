import { Controller } from '@nestjs/common';
import { GitAlertService } from './git-alert.service';

@Controller('projects/:projectId/git-alerts')
export class GitAlertController {
  constructor(private readonly gitAlertService: GitAlertService) {}

  // @Post()
  // async createGitAlert(
  //   @Param('projectId') projectId: string,
  //   @Body() createGitAlertDto: CreateGitAlertDto,
  //   @CurrentUser() currentUser: User,
  // ) {
  //   return this.gitAlertService.createGitAlert(projectId, createGitAlertDto, currentUser);
  // }

  // @Put(':alertId')
  // async updateGitAlert(
  //   @Param('projectId') projectId: string,
  //   @Param('alertId') alertId: string,
  //   @Body() updateGitAlertDto: UpdateGitAlertDto,
  //   @CurrentUser() currentUser: User,
  // ) {
  //   return this.gitAlertService.updateGitAlert(projectId, alertId, updateGitAlertDto, currentUser);
  // }

  // @Get()
  // async findGitAlertsByProject(
  //   @Param('projectId') projectId: string,
  //   @Query() searchDto: SearchGitAlertDto,
  // ) {
  //   return this.gitAlertService.findGitAlertsByProject(projectId, searchDto);
  // }

  // @Get('summary')
  // async getGitAlertSummary(@Param('projectId') projectId: string) {
  //   return this.gitAlertService.getGitAlertSummary(projectId);
  // }

  // @Get(':alertId')
  // async findGitAlertById(@Param('projectId') projectId: string, @Param('alertId') alertId: string) {
  //   return this.gitAlertService.findGitAlertById(projectId, alertId);
  // }

  // @Delete(':alertId')
  // async deleteGitAlert(@Param('projectId') projectId: string, @Param('alertId') alertId: string) {
  //   return this.gitAlertService.deleteGitAlert(projectId, alertId);
  // }

  // @Patch(':alertId/mark-as-read')
  // async markAsRead(
  //   @Param('projectId') projectId: string,
  //   @Param('alertId') alertId: string,
  //   @CurrentUser() currentUser: User,
  // ) {
  //   return this.gitAlertService.markAsRead(projectId, alertId, currentUser);
  // }

  // @Patch('mark-all-as-read')
  // async markAllAsRead(@Param('projectId') projectId: string, @CurrentUser() currentUser: User) {
  //   return this.gitAlertService.markAllAsRead(projectId, currentUser);
  // }

  // @Get('repositories/:repositoryId')
  // async findGitAlertsByRepository(
  //   @Param('projectId') projectId: string,
  //   @Param('repositoryId') repositoryId: string,
  //   @Query('limit') limit?: number,
  // ) {
  //   return this.gitAlertService.findGitAlertsByRepository(projectId, repositoryId, limit);
  // }
}
