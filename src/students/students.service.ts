import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {

  private students = [
    {
        id: 1,
        fName: "John",
        lName: "Doe",
        dob: "2000-01-01",
        program: "ASCG",
        year: "2024-01-01",
    },
    {
        id: 2,
        fName: "Jane",
        lName: "Smith",
        dob: "1999-03-12",
        program: "CBC",
        year: "2023-01-01",
    },
    {
        id: 3,
        fName: "Alice",
        lName: "Johnson",
        dob: "2001-07-22",
        program: "SSC",
        year: "2022-01-01",
    },
    {
        id: 4,
        fName: "Bob",
        lName: "Williams",
        dob: "1998-05-15",
        program: "DSC",
        year: "2021-01-01",
    },
    {
        id: 5,
        fName: "Emily",
        lName: "Brown",
        dob: "2002-09-03",
        program: "ASCG",
        year: "2024-01-01",
    },
    {
        id: 6,
        fName: "Chris",
        lName: "Davis",
        dob: "1997-11-30",
        program: "CBC",
        year: "2022-01-01",
    },
    {
        id: 7,
        fName: "Sophie",
        lName: "Martinez",
        dob: "2003-02-19",
        program: "SSC",
        year: "2023-01-01",
    },
    {
        id: 8,
        fName: "Michael",
        lName: "Garcia",
        dob: "2000-06-25",
        program: "DSC",
        year: "2021-01-01",
    },
    {
        id: 9,
        fName: "David",
        lName: "Rodriguez",
        dob: "1996-12-05",
        program: "ASCG",
        year: "2024-01-01",
    },
    {
        id: 10,
        fName: "Olivia",
        lName: "Hernandez",
        dob: "2001-04-10",
        program: "CBC",
        year: "2022-01-01",
    }
];

  create(createStudentDto: CreateStudentDto) {
    return { ...createStudentDto };
  }

  findAll(program) {
    if (program) {
      const students = this.students.filter(student=>student.program === program)
      return {
        length: students.length, students
      }
    }
    return this.students
  }

  findOne(id: number) {
    const student = this.students.find(student=>student.id === id)
    return student;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = this.findOne(id)
    const updateStudent = {...student, ...updateStudentDto}
    return updateStudent;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
