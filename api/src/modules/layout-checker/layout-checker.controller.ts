import { Public } from '@decorators/auth.decorator';
import { Body, Controller, Get } from '@nestjs/common';
import { CreateLayoutCheckerDto } from './dtos/create.dto';
import { LayoutCheckerService } from './layout-checker.service';

@Controller('layout-checker')
export class LayoutCheckerController {
  constructor(private readonly layoutCheckerService: LayoutCheckerService) {}

  @Public()
  @Get('check')
  async checkLayout(@Body() body: CreateLayoutCheckerDto) {
    const { diffBuffer, diffRatio } = await this.layoutCheckerService.checkLayout(body);
    return {
      matchRatio: (1 - diffRatio).toFixed(2),
      diffImage: diffBuffer.toString('base64'),
    };
  }
}
