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
      const combined = [createStudentDto.fName, createStudentDto.lName, createStudentDto.dob, createStudentDto.program, createStudentDto.year].sort().join('-')
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
  async findAll(program: Program): Promise<Student[]> {
    if (program) {
      return this.studentModel.find({
        program
      }).exec()
    }
    return this.studentModel.find().exec()
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
    return this.studentModel.findByIdAndUpdate(id, updateStudentDto, { new: true }).exec()
  }

  async remove(id: string): Promise<Student> {
    return this.studentModel.findByIdAndDelete(id).exec()
  }
}
