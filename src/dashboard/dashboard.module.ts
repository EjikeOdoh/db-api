import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/students/schema/student.schema';
import { Staff, StaffSchema } from 'src/staff/schema/staff.schema';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
    imports:[MongooseModule.forFeature([{name: Student.name, schema:StudentSchema},
      {name: Staff.name, schema:StaffSchema}

    ])],
})
export class DashboardModule {}
