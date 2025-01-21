import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './schema/student.schema'
import { Program } from 'src/enums/program.enum';

@Injectable()
export class StudentsService {
  constructor(@InjectModel(Student.name) private studentModel: Model<Student>) { }

  @ApiCreatedResponse({
    description: "Student Record was added successfully"
  })
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      const combined = [
        createStudentDto.fName.trim().toLowerCase(),
        createStudentDto.lName.trim().toLowerCase(),
        createStudentDto.dob,
        createStudentDto.program.trim().toLowerCase(),
        createStudentDto.year.toString()
      ].sort().join('-')
      const newStudent = new this.studentModel({ ...createStudentDto, combined })
      return newStudent.save()
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Duplicate detected')
      }
      throw error
    }
  }

  @ApiOkResponse({
    type: Student,
    isArray: true
  })
  async findAll(p: number, program: Program, host: string) {

    let students: Student[] = []
    let totalCount: number
    const recordPerPage = 50

    if (program) {
      totalCount = await this.studentModel.countDocuments({ program: { $in: program } });
      students = await this.studentModel.find({
        program
      }).
        skip(p * recordPerPage).
        limit(recordPerPage).
        exec()

      return this.handlePagination(students, host,totalCount, p, program)
    }

    totalCount = await this.studentModel.estimatedDocumentCount()
    students = await this.studentModel.find().
    skip(p * recordPerPage).
    limit(recordPerPage).
    exec()

    return this.handlePagination(students, host,totalCount,p,program)
  }

  @ApiOkResponse({
    type: Student,
    isArray: false
  })
  @ApiNotFoundResponse({
    description: 'Not found'
  })
  @ApiBadRequestResponse({
    description: 'Bad Request'
  })
  async findOne(id: string) {
    return this.studentModel.findById(id).exec()
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    try {
      const combined = [updateStudentDto.fName, updateStudentDto.lName, updateStudentDto.dob, updateStudentDto.program, updateStudentDto.year].sort().join('-')
      return this.studentModel.findByIdAndUpdate(id, { ...updateStudentDto, combined }, { new: true }).exec()
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Duplicate detected')
      }
      throw error
    }
  }

  async remove(id: string): Promise<Student> {
    return this.studentModel.findByIdAndDelete(id).exec()
  }

  private handlePagination(arr: Student[], host: string, tCount:number, page: number, program: string = "",) {
    let nextPage: string = ""
    let currentPage: string = ""
    let previousPage: string = ""
    const recordPerPage = 50
    const lastPage = Math.round(tCount / recordPerPage)

    const count = arr.length
    currentPage = `${host}/students?program=${program}&p=${Math.min(page, lastPage)}`
    previousPage = page > 1 && page < lastPage ? `${host}/students?program=${program}&p=${page - 1}` : page >= lastPage ? `${host}/students?program=${program}&p=${lastPage - 1}` : null
    nextPage = count < recordPerPage ? null : `${host}/students?program=${program}&p=${page + 1}`
    return { totalCount: tCount, nextPage, previousPage, currentPage, pageCount:count }
  }
}
