import { Public } from '@decorators/auth.decorator';
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { LayoutCheckerService } from './layout-checker.service';

@Controller('layout-checker')
export class LayoutCheckerController {
  constructor(private readonly layoutCheckerService: LayoutCheckerService) {}

  @Public()
  @Get('check')
  async checkLayout(@Res() res: Response) {
    const { diffBuffer, diffRatio, analysisFromAI } = await this.layoutCheckerService.checkLayout();
    res.type('application/json').send({
      matchRatio: (1 - diffRatio).toFixed(2),
      analysisFromAI,
      diffImage: diffBuffer.toString('base64'),
    });
  }
}
