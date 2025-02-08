import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { unlink } from 'fs';
import { Model } from 'mongoose';
import { Staff } from 'src/staff/schema/staff.schema';
import { Student } from 'src/students/schema/student.schema';

@Injectable()
export class DashboardService {
    constructor(@InjectModel(Student.name) private studentModel: Model<Student>,
        @InjectModel(Staff.name) private staffModel: Model<Staff>
    ) { }

    async getStats(year?: number) {
        let programStat: any;
        let countryStat: any;
        let studentsCount: number = await this.studentModel.find().estimatedDocumentCount().exec()
        let uniqueStudentCount = await this.studentModel.aggregate([
            {
                $group: {
                    _id: "$uniqueProp"
                }
            },
            { $count: "uniqueStudents" }
        ])
        uniqueStudentCount = uniqueStudentCount.length > 0 ? uniqueStudentCount[0].uniqueStudents : 0
        let staffCount: number = await this.staffModel.find().estimatedDocumentCount().exec()

        let yearlyStudentCounts = await this.studentModel.aggregate([
            {
                $group: {
                    _id: '$year',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id',
                    count: 1
                }
            },

        ])
        yearlyStudentCounts = yearlyStudentCounts.reduce((acc, item) => {
            acc[item.year] = item.count;
            return acc;
        }, {});

        if (year) {
            let uniqueStudentCount = await this.studentModel.aggregate([
                {$match: {year} },
                {
                    $group: {
                        _id: "$uniqueProp"
                    }
                },
                { $count: "uniqueStudents" }
            ])
            uniqueStudentCount = uniqueStudentCount.length > 0 ? uniqueStudentCount[0].uniqueStudents : 0

            programStat = await this.studentModel.aggregate([
                { $match: { year } },
                {
                    $group: {
                        _id: "$program", count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        program: '$_id',
                        count: 1
                    }
                },
            ])
            programStat = programStat.reduce((acc, item) => {
                acc[item.program] = item.count;
                return acc;
            }, {});

            countryStat = await this.studentModel.aggregate([
                { $match: { year } },
                {
                    $group: {
                        _id: "$country", count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        country: '$_id',
                        count: 1
                    }
                },
            ])
            countryStat = countryStat.reduce((acc, item) => {
                acc[item.country] = item.count;
                return acc;
            }, {});

            studentsCount = await this.studentModel.find({ year }).countDocuments().exec()

            return {
                year, studentsCount, uniqueStudentCount, staffCount, yearlyStudentCounts, programStat, countryStat,
            }
        }


        programStat = await this.studentModel.aggregate([
            {
                $group: {
                    _id: "$program", count: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    program: '$_id',
                    count: 1
                }
            },
        ])
        programStat = programStat.reduce((acc, item) => {
            acc[item.program] = item.count;
            return acc;
        }, {});

        countryStat = await this.studentModel.aggregate([
            {

                $group: {
                    _id: "$country", count: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    country: '$_id',
                    count: 1
                }
            },
        ])
        countryStat = countryStat.reduce((acc, item) => {
            acc[item.country] = item.count;
            return acc;
        }, {});


        return {
            studentsCount, uniqueStudentCount, staffCount, yearlyStudentCounts, programStat, countryStat,
        }
    }

}
