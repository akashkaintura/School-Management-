import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { SchoolId } from '../../decorators/school-id.decorator';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) { }

  @Get()
  findAll(@SchoolId() schoolId: string) {
    return this.classesService.findAll(schoolId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @SchoolId() schoolId: string) {
    return this.classesService.findOne(id, schoolId);
  }

  @Post()
  create(@Body() createClassDto: any) {
    return this.classesService.create(createClassDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateClassDto: any) {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }
}
