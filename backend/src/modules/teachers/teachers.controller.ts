import { Controller, Get, Param } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { SchoolId } from '../../decorators/school-id.decorator';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) { }

  @Get()
  findAll(@SchoolId() schoolId: string) {
    return this.teachersService.findAll(schoolId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @SchoolId() schoolId: string) {
    return this.teachersService.findOne(id, schoolId);
  }
}
