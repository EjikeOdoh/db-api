import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { StaffModule } from './staff/staff.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),MongooseModule.forRoot(
    process.env.URI
    )   
    ,StudentsModule, StaffModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
