import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path'
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:"Excel sheet of students",
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const filePath = path.resolve(file.path)
    await this.uploadsService.processFile(filePath)
  }
}
