import { Controller, Get, Post, Body, Param, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttendanceService } from './attendance.service';
import * as XLSX from 'xlsx';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  @Post()
  markAttendance(@Body() markAttendanceDto: any) {
    return this.attendanceService.markAttendance({
      studentId: markAttendanceDto.studentId,
      markedBy: markAttendanceDto.markedBy,
      date: new Date(markAttendanceDto.date),
      status: markAttendanceDto.status,
      remarks: markAttendanceDto.remarks,
    });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAttendance(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { classId: string; date: string; markedBy: string },
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet) as any[];

    // Validate and map data
    const records = data.map((row) => ({
      rollNumber: row['Roll Number']?.toString() || row['rollNumber']?.toString(),
      status: (row['Status'] || row['status'])?.toUpperCase(),
      remarks: row['Remarks'] || row['remarks'],
    })).filter(r => r.rollNumber && r.status);

    if (records.length === 0) {
      throw new BadRequestException('No valid records found in file');
    }

    return this.attendanceService.bulkUploadAttendance({
      classId: body.classId,
      date: new Date(body.date),
      markedBy: body.markedBy,
      records: records as any[],
    });
  }

  @Get('student/:studentId/detailed')
  getAttendanceByStudentDetailed(
    @Param('studentId') studentId: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.getAttendanceByStudent(
      studentId,
      date ? new Date(date) : undefined,
    );
  }

  @Get('student/:studentId')
  getAttendanceByStudent(@Param('studentId') studentId: string) {
    return this.attendanceService.getAttendanceByStudent(studentId);
  }

  @Get('student/:studentId/stats')
  getAttendanceStats(@Param('studentId') studentId: string) {
    return this.attendanceService.getAttendanceStats(studentId);
  }
}
