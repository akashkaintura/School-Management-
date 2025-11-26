import { Controller, Get, Param } from '@nestjs/common';
import { ParentsService } from './parents.service';

@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) { }

  @Get()
  getAllParents() {
    return this.parentsService.getAllParents();
  }

  @Get(':id')
  getParentById(@Param('id') id: string) {
    return this.parentsService.getParentById(id);
  }
}
