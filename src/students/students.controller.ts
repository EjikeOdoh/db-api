import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query, ParseIntPipe, DefaultValuePipe, Headers, UseGuards, } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Program } from 'src/enums/program.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum.';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) { }

  @Post()
  async create(@Body(ValidationPipe) createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  async findAll(@Headers('host') host:string, @Query('p', new DefaultValuePipe(0), ParseIntPipe) p: number, @Query('program') program?: Program) {
    return this.studentsService.findAll(p, program, host);
  }

  @Get('search')
  async search(@Query('name') name: string, @Query('program') program?: Program) {
    return this.studentsService.search(name, program)
  }

  @Get('year')
  async yearCount(@Query('year') year: number, @Query('program') program?: Program) {
    return this.studentsService.yearCount(year, program)
  }

  @Roles(Role.Admin)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body(ValidationPipe) updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.studentsService.remove(id)
  }
}
