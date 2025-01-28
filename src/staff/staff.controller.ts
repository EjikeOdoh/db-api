import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Headers, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Public } from 'src/decorators/decorators';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum.';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

 
  @Public()
  @Post()
  create(@Body(ValidationPipe) createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  findAll(@Headers('host') host:string, @Query('p', new DefaultValuePipe(0), ParseIntPipe) p: number, @Query('status') status?: boolean)  {
    return this.staffService.findAll(host, p, status);
  }

  @Get('search')
  async search(@Query('name') name: string) {
    return this.staffService.search(name)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(id, updateStaffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}
