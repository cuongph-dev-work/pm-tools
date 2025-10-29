import { CurrentUser } from '@decorators/current-user.decorator';
import { User } from '@entities/user.entity';
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetFileDto } from './dtos/get-file.dto';
import { FileStorageService } from './file-storage.service';

@Controller('file-storage')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: User) {
    return this.fileStorageService.uploadFile(file, user);
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Query() query: GetFileDto) {
    return this.fileStorageService.getFile(id, query);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFile(@Param('id') id: string, @CurrentUser() user: User) {
    return this.fileStorageService.deleteFile(id, user);
  }
}
