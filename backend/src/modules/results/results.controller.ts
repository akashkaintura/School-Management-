import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResultsService } from './results.service';
import * as XLSX from 'xlsx';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) { }

  @Post()
  createResult(@Body() createResultDto: any) {
    return this.resultsService.createResult(createResultDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadResults(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { examId: string; classId: string; subjectId: string },
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
      marksObtained: Number(row['Marks Obtained'] || row['marksObtained']),
      maxMarks: Number(row['Max Marks'] || row['maxMarks']),
      grade: row['Grade'] || row['grade'],
      remarks: row['Remarks'] || row['remarks'],
    })).filter(r => r.rollNumber && !isNaN(r.marksObtained) && !isNaN(r.maxMarks));

    if (records.length === 0) {
      throw new BadRequestException('No valid records found in file');
    }

    return this.resultsService.bulkUploadResults({
      examId: body.examId,
      classId: body.classId,
      subjectId: body.subjectId,
      records: records,
    });
  }

  @Get('student/:studentId')
  getResultsByStudent(@Param('studentId') studentId: string) {
    return this.resultsService.getResultsByStudent(studentId);
  }

  @Get('exam/:examId')
  getResultsByExam(@Param('examId') examId: string) {
    return this.resultsService.getResultsByExam(examId);
  }
}
