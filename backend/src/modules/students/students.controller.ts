import { Controller, Get, Param } from '@nestjs/common';
import { StudentsService } from './students.service';
import { SchoolId } from '../../decorators/school-id.decorator';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) { }

  @Get()
  findAll(@SchoolId() schoolId: string) {
    return this.studentsService.findAll(schoolId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @SchoolId() schoolId: string) {
    return this.studentsService.findOne(id, schoolId);
  }
}
