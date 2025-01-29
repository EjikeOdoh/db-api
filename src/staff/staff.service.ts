import { ConflictException, Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { Staff } from './schema/staff.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class StaffService {
  constructor(@InjectModel(Staff.name) private staffModel: Model<Staff>) { }

  async findStaff(email: string): Promise<Staff | undefined> {
    return this.staffModel.findOne({
      email
    })
  }

  @ApiCreatedResponse({
    description: "Staff Record was added successfully"
  })
  create(createStaffDto: CreateStaffDto): Promise<Staff | undefined> {
    try {
      const fullName = [createStaffDto.fName.trim().toLowerCase(),
      createStaffDto.lName.trim().toLowerCase()].sort().join('')
      const newStaff = new this.staffModel({ ...createStaffDto, fullName })
      return newStaff.save()
    } catch (error) {
      throw error
    }
  }

  @ApiOkResponse({
    type: Staff,
    isArray: true
  })
  async findAll(host: string, p: number, status?: boolean) {
    let staff: Staff[] = []
    let totalCount: number
    const recordPerPage = 10

    if (status) {
      totalCount = await this.staffModel.countDocuments({ isActive: { $in: status } });
      staff = await this.staffModel.find({
        isActive: { $in: status }
      }).
        skip(p * recordPerPage).
        limit(recordPerPage).
        select('-fullName -__v').
        exec()

      return this.handlePagination(staff, host, totalCount, p, status)
    }

    totalCount = await this.staffModel.estimatedDocumentCount()
    staff = await this.staffModel.find().
      skip(p * recordPerPage).
      limit(recordPerPage).
      select('-fullName -__v').
      exec()

    return this.handlePagination(staff, host, totalCount, p, status)
  }

  @ApiOkResponse({
    type: Staff,
    isArray: false
  })
  @ApiNotFoundResponse({
    description: 'Not found'
  })
  @ApiBadRequestResponse({
    description: 'Bad Request'
  })
  async findOne(id: string) {
    return await this.staffModel.findById(id, '-password -fullName -__v').exec()
  }

  @ApiOkResponse({
    description: "Staff record updated successfully"
  })
  update(id: string, updateStaffDto: UpdateStaffDto) {
    try {
      return this.staffModel.findByIdAndUpdate(id, { ...updateStaffDto }, { new: true }).exec()
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Duplicate detected')
      }
      throw error
    }
  }

  @ApiOkResponse({
    type: Staff,
    isArray: false,
    description: "Staff removed successfully"
  })
  @ApiBadRequestResponse({
    description: 'Bad Request'
  })
  remove(id: string) {
    return this.staffModel.findByIdAndDelete(id)
  }

  @ApiOkResponse({
    type: Staff,
    isArray: true
  })
  async search(name: string) {
    let staff = await this.staffModel.find({
      fullName: { $regex: name, $options: 'i' }
    }).
      select('-fullName -__v').
      exec()

    return {
      count: staff.length,
      data: staff
    }
  }

  private handlePagination(arr: Staff[], host: string, tCount: number, page: number, status?: boolean) {
    let nextPage: string = ""
    let currentPage: string = ""
    let previousPage: string = ""
    const recordPerPage = 10
    const lastPage = Math.round(tCount / recordPerPage)

    const count = arr.length
    currentPage = `${host}/staff?status=${status}&p=${Math.min(page, lastPage)}`
    previousPage = page >= 1 && page < lastPage ? `${host}/staff?status=${status}&p=${page - 1}` : page >= lastPage ? `${host}/staff?status=${status}&p=${lastPage - 1}` : null
    nextPage = count < recordPerPage ? null : `${host}/staff?status=${status}&p=${page + 1}`
    return { totalCount: tCount, nextPage, previousPage, currentPage, pageCount: count, data: arr }
  }
}
