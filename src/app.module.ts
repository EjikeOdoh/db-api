import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [ConfigModule.forRoot(),MongooseModule.forRoot("mongodb+srv://devE:23101995@nodeexpressproject.k17nlb6.mongodb.net/dbms?retryWrites=true&w=majority&appName=NodeExpressProject"),StudentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
