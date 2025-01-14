import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  upload(file: Express.Multer.File) {
    return {
      message: 'File uploaded',
      file: file.filename
    }
  }
}
