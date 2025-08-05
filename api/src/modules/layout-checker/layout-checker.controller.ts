import { Public } from '@decorators/auth.decorator';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommentOnDiffDto } from './dtos/comment-on-diff.dto';
import { CreateLayoutCheckerDto } from './dtos/create.dto';
import { LayoutCheckerService } from './layout-checker.service';

@Controller('projects/:projectId/layout-checker')
export class LayoutCheckerController {
  constructor(private readonly layoutCheckerService: LayoutCheckerService) {}

  @Public()
  @Post('check')
  async checkLayout(@Param('projectId') projectId: string, @Body() body: CreateLayoutCheckerDto) {
    const { diffBuffer, diffRatio } = await this.layoutCheckerService.checkLayout(projectId, body);
    return {
      matchRatio: (1 - diffRatio).toFixed(2),
      diffImage: diffBuffer.toString('base64'),
    };
  }

  @Post(':diffId/comment')
  async commentOnDiff(@Param('diffId') diffId: string, @Body() body: CommentOnDiffDto) {
    return this.layoutCheckerService.commentOnDiff(diffId, body);
  }
}
