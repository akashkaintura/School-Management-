import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AttendanceService {
    constructor(private prisma: PrismaService) { }

    async markAttendance(data: {
        studentId: string;
        markedBy: string; // teacherId
        date: Date;
        status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
        remarks?: string;
    }) {
        return this.prisma.attendance.create({
            data: {
                studentId: data.studentId,
                markedBy: data.markedBy,
                date: data.date,
                status: data.status,
                remarks: data.remarks,
            },
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
            },
        });
    }

    async getAttendanceByStudent(studentId: string, date?: Date) {
        const whereClause: any = { studentId };
        if (date) {
            whereClause.date = date;
        }

        return this.prisma.attendance.findMany({
            where: whereClause,
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
            },
            orderBy: {
                date: 'desc',
            },
        });
    }

    async getAttendanceByStudentDetailed(studentId: string) {
        return this.prisma.attendance.findMany({
            where: { studentId },
            include: {
                teacher: {
                    include: {
                        user: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
        });
    }

    async getAttendanceStats(studentId: string) {
        const total = await this.prisma.attendance.count({
            where: { studentId },
        });

        const present = await this.prisma.attendance.count({
            where: { studentId, status: 'PRESENT' },
        });

        const absent = await this.prisma.attendance.count({
            where: { studentId, status: 'ABSENT' },
        });

        const late = await this.prisma.attendance.count({
            where: { studentId, status: 'LATE' },
        });

        return {
            total,
            present,
            absent,
            late,
            percentage: total > 0 ? (present / total) * 100 : 0,
        };
    }

    async bulkUploadAttendance(data: {
        classId: string;
        date: Date;
        markedBy: string;
        records: Array<{
            rollNumber: string;
            status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
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
                        row: i + 2, // +2 because row 1 is header, array is 0-indexed
                        rollNumber: record.rollNumber,
                        error: 'Student not found in this class',
                    });
                    continue;
                }

                // Check for duplicate
                const existing = await this.prisma.attendance.findFirst({
                    where: {
                        studentId: student.id,
                        date: data.date,
                    },
                });

                if (existing) {
                    results.failed++;
                    results.errors.push({
                        row: i + 2,
                        rollNumber: record.rollNumber,
                        error: 'Attendance already marked for this date',
                    });
                    continue;
                }

                // Create attendance record
                await this.prisma.attendance.create({
                    data: {
                        studentId: student.id,
                        markedBy: data.markedBy,
                        date: data.date,
                        status: record.status,
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

