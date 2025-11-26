import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { Board } from '@prisma/client';

@Controller('subjects')
export class SubjectsController {
    constructor(private readonly subjectsService: SubjectsService) { }

    @Post()
    createSubject(@Body() data: {
        name: string;
        code: string;
        description?: string;
        board?: Board;
    }) {
        return this.subjectsService.createSubject(data);
    }

    @Get()
    getAllSubjects(@Query('board') board?: Board) {
        return this.subjectsService.getAllSubjects(board);
    }

    @Get(':id')
    getSubject(@Param('id') id: string) {
        return this.subjectsService.getSubjectById(id);
    }

    @Put(':id')
    updateSubject(
        @Param('id') id: string,
        @Body() data: {
            name?: string;
            code?: string;
            description?: string;
            board?: Board;
        },
    ) {
        return this.subjectsService.updateSubject(id, data);
    }

    @Delete(':id')
    deleteSubject(@Param('id') id: string) {
        return this.subjectsService.deleteSubject(id);
    }

    @Post(':id/assign-class')
    assignToClass(
        @Param('id') subjectId: string,
        @Body() data: {
            classId: string;
            teacherId: string;
        },
    ) {
        return this.subjectsService.assignSubjectToClass({
            subjectId,
            ...data,
        });
    }

    @Delete(':id/remove-class/:classId')
    removeFromClass(
        @Param('id') subjectId: string,
        @Param('classId') classId: string,
    ) {
        return this.subjectsService.removeSubjectFromClass(subjectId, classId);
    }

    @Post(':id/assign-teacher')
    assignTeacher(
        @Param('id') subjectId: string,
        @Body() data: {
            classId: string;
            teacherId: string;
        },
    ) {
        return this.subjectsService.assignTeacherToSubject({
            subjectId,
            ...data,
        });
    }

    @Get('class/:classId')
    getClassSubjects(@Param('classId') classId: string) {
        return this.subjectsService.getSubjectsByClass(classId);
    }
}
