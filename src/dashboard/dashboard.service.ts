import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Staff } from 'src/staff/schema/staff.schema';
import { Student } from 'src/students/schema/student.schema';
import { StudentsService } from 'src/students/students.service';

@Injectable()
export class DashboardService {
    constructor(@InjectModel(Student.name) private studentModel: Model<Student>,
        @InjectModel(Staff.name) private staffModel: Model<Staff>
    ) { }

    async getStats() {
        const studentStats = await this.studentModel.aggregate([
            {
                $group: {
                    _id: "$program", count: {
                        $sum: 1
                    }
                }
            }
        ])

        const countryStat:any[] = await this.studentModel.aggregate([
            {
                $group: {
                    _id: "$country", count: {
                        $sum: 1
                    }
                }
            }
        ])

        const studentCount = await this.studentModel.find().estimatedDocumentCount().exec()

        const staffCount = await this.staffModel.find().estimatedDocumentCount().exec()

        return {
            studentStats, countryStat, studentCount, staffCount
        }
    }

}
