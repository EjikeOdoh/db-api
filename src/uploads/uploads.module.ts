import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/students/schema/student.schema';
import * as path from 'path'


@Module({
  imports:[
    MongooseModule.forFeature([{name: Student.name, schema:StudentSchema}]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          // Preserve the original file name
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const originalName = file.originalname.replace(/\s+/g, '_'); // Replace spaces with underscores
          const ext = path.extname(originalName);
          const name = path.basename(originalName, ext);
          callback(null, `${name}-${uniqueSuffix}${ext}`);
        },
      })
    })
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports:[UploadsService]
})
export class UploadsModule {}
