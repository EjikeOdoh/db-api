import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


@Module({
  imports:[
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
      })
    })
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
