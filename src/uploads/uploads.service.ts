import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs'
import { parse } from 'csv-parse'
import * as XLSX from 'xlsx'
import { Student } from 'src/students/schema/student.schema';
import { CreateStudentDto } from 'src/students/dto/create-student.dto';


@Injectable()
export class UploadsService {
  constructor(@InjectModel(Student.name) private studentModel: Model<Student>) { }

  async processFile(filePath: string): Promise<void> {
    try {
      const extension = filePath.split('.').pop();
      let records: any[];
      console.log('Hello', extension);
      if (extension === 'csv') {
        records = await this.parseCSV(filePath);
      } else if (extension === 'xlsx') {
        records = this.parseXLSX(filePath);
      } else {
        throw new HttpException(
          'Unsupported file format',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Bulk insert, skipping duplicates
      await this.bulkInsert(records);
      this.deleteFile(filePath)
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error processing the file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  deleteFile(filePath: string): void {
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.error('File not found');
        } else {
          console.error('Error deleting file:', err);
        }
        return;
      }
      console.log(`File at ${filePath} deleted successfully`);
    });
  }

  private async parseCSV(filePath: string): Promise<any[]> {
    const records: any[] = [];
    const parser = fs.createReadStream(filePath).pipe(parse({ columns: true }));

    for await (const record of parser) {
      records.push(record);
    }

    return records;
  }

  private parseXLSX(filePath: string): any[] {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }

  private async bulkInsert(records: CreateStudentDto[]): Promise<void> {
    const bulkOperations = records.map((student) => {
      const combined = [
        student.fName.trim().toLowerCase(),
        student.lName.trim().toLowerCase(),
        student.dob,
        student.program.trim().toLowerCase(),
        student.year,
      ].sort().join('-');

      return {
        updateOne: {
          filter: { combined },
          update: { $set: { ...student, combined } },
          upsert: true,
        },
      };
    });

    await this.studentModel.bulkWrite(bulkOperations);
  }
}
