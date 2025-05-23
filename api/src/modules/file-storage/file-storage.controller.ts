import {
  Controller,
  Post,
  Get,
  Delete,
  UseInterceptors,
  UploadedFile,
  Param,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileStorageService } from './file-storage.service';
import { RequestWithUser } from 'src/types/request.type';
import { GetFileDto } from './dtos/get-file.dto';

@Controller('file-storage')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    return this.fileStorageService.uploadFile(file, req.user);
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Query() query: GetFileDto) {
    return this.fileStorageService.getFile(id, query);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFile(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.fileStorageService.deleteFile(id, req.user);
  }
}
