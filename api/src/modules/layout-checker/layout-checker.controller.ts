import { Public } from '@decorators/auth.decorator';
import { Body, Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateLayoutCheckerDto } from './dtos/create.dto';
import { LayoutCheckerService } from './layout-checker.service';

@Controller('layout-checker')
export class LayoutCheckerController {
  constructor(private readonly layoutCheckerService: LayoutCheckerService) {}

  @Public()
  @Get('check')
  async checkLayout(@Res() res: Response, @Body() body: CreateLayoutCheckerDto) {
    const { diffBuffer, diffRatio } = await this.layoutCheckerService.checkLayout(body);
    res.type('application/json').send({
      matchRatio: (1 - diffRatio).toFixed(2),
      diffImage: diffBuffer.toString('base64'),
    });
  }
}
