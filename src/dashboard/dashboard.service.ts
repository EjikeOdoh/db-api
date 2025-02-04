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

    async getStats(year?: number) {
        let studentStats;
        let studentCount
        let countryStat
        let staffCount

        if (year) {
            studentStats = await this.studentModel.aggregate([
                { $match: { year } },
                {
                    $group: {
                        _id: "$program", count: {
                            $sum: 1
                        }
                    }
                }
            ])

            countryStat = await this.studentModel.aggregate([
                { $match: { year } },
                {
                    $group: {
                        _id: "$country", count: {
                            $sum: 1
                        }
                    }
                }
            ])

            studentCount = await this.studentModel.find({ year }).countDocuments().exec()

            staffCount = await this.staffModel.find().estimatedDocumentCount().exec()

            return {
                studentStats, countryStat, studentCount, staffCount
            }
        }


        studentStats = await this.studentModel.aggregate([
            {
                $group: {
                    _id: "$program", count: {
                        $sum: 1
                    }
                }
            }
        ])

        countryStat = await this.studentModel.aggregate([
            {

                $group: {
                    _id: "$country", count: {
                        $sum: 1
                    }
                }
            }
        ])

        studentCount = await this.studentModel.find().estimatedDocumentCount().exec()

        staffCount = await this.staffModel.find().estimatedDocumentCount().exec()

        return {
            year, studentStats, countryStat, studentCount, staffCount
        }
    }

}
