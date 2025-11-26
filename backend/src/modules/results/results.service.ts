import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ResultsService {
    constructor(private prisma: PrismaService) { }

    async createResult(data: {
        studentId: string;
        examId: string;
        subjectId: string;
        marksObtained: number;
        maxMarks: number;
        grade?: string;
        remarks?: string;
    }) {
        const percentage = (data.marksObtained / data.maxMarks) * 100;

        return this.prisma.result.create({
            data: {
                studentId: data.studentId,
                examId: data.examId,
                subjectId: data.subjectId,
                marksObtained: data.marksObtained,
                maxMarks: data.maxMarks,
                percentage,
                grade: data.grade,
                remarks: data.remarks,
            },
        });
    }

    async getResultsByStudent(studentId: string) {
        return this.prisma.result.findMany({
            where: { studentId },
            include: {
                exam: true,
                subject: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getResultsByExam(examId: string) {
        return this.prisma.result.findMany({
            where: { examId },
            include: {
                student: {
                    include: {
                        user: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                },
                subject: true,
            },
            orderBy: {
                percentage: 'desc',
            },
        });
    }
    async bulkUploadResults(data: {
        examId: string;
        classId: string;
        subjectId: string;
        records: Array<{
            rollNumber: string;
            marksObtained: number;
            maxMarks: number;
            grade?: string;
            remarks?: string;
        }>;
    }) {
        const results = {
            total: data.records.length,
            successful: 0,
            failed: 0,
            errors: [] as Array<{ row: number; rollNumber: string; error: string }>,
        };

        for (let i = 0; i < data.records.length; i++) {
            const record = data.records[i];
            try {
                // Find student by roll number in the class
                const student = await this.prisma.student.findFirst({
                    where: {
                        rollNumber: record.rollNumber,
                        classId: data.classId,
                    },
                });

                if (!student) {
                    results.failed++;
                    results.errors.push({
                        row: i + 2,
                        rollNumber: record.rollNumber,
                        error: 'Student not found in this class',
                    });
                    continue;
                }

                // Check for duplicate
                const existing = await this.prisma.result.findFirst({
                    where: {
                        studentId: student.id,
                        examId: data.examId,
                        subjectId: data.subjectId,
                    },
                });

                if (existing) {
                    results.failed++;
                    results.errors.push({
                        row: i + 2,
                        rollNumber: record.rollNumber,
                        error: 'Result already exists for this exam and subject',
                    });
                    continue;
                }

                // Validate marks
                if (record.marksObtained > record.maxMarks) {
                    results.failed++;
                    results.errors.push({
                        row: i + 2,
                        rollNumber: record.rollNumber,
                        error: 'Marks obtained cannot be greater than max marks',
                    });
                    continue;
                }

                const percentage = (record.marksObtained / record.maxMarks) * 100;

                // Create result record
                await this.prisma.result.create({
                    data: {
                        studentId: student.id,
                        examId: data.examId,
                        subjectId: data.subjectId,
                        marksObtained: record.marksObtained,
                        maxMarks: record.maxMarks,
                        percentage,
                        grade: record.grade,
                        remarks: record.remarks,
                    },
                });

                results.successful++;
            } catch (error) {
                results.failed++;
                results.errors.push({
                    row: i + 2,
                    rollNumber: record.rollNumber,
                    error: error.message || 'Unknown error',
                });
            }
        }

        return results;
    }
}

