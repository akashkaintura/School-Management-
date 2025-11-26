import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Board } from '@prisma/client';

@Injectable()
export class SubjectsService {
    constructor(private prisma: PrismaService) { }

    async createSubject(data: {
        name: string;
        code: string;
        description?: string;
        board?: Board;
    }) {
        return this.prisma.subject.create({
            data: {
                name: data.name,
                code: data.code,
                description: data.description,
                board: data.board,
            },
        });
    }

    async getAllSubjects(board?: Board) {
        const where = board ? { board } : {};
        return this.prisma.subject.findMany({
            where,
            include: {
                classSubjects: {
                    include: {
                        class: true,
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
                },
            },
            orderBy: { name: 'asc' },
        });
    }

    async getSubjectById(id: string) {
        const subject = await this.prisma.subject.findUnique({
            where: { id },
            include: {
                classSubjects: {
                    include: {
                        class: true,
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
                },
            },
        });

        if (!subject) {
            throw new NotFoundException('Subject not found');
        }

        return subject;
    }

    async updateSubject(id: string, data: {
        name?: string;
        code?: string;
        description?: string;
        board?: Board;
    }) {
        return this.prisma.subject.update({
            where: { id },
            data,
        });
    }

    async deleteSubject(id: string) {
        // First delete all class-subject associations
        await this.prisma.classSubject.deleteMany({
            where: { subjectId: id },
        });

        // Then delete the subject
        return this.prisma.subject.delete({
            where: { id },
        });
    }

    async assignSubjectToClass(data: {
        subjectId: string;
        classId: string;
        teacherId: string;
    }) {
        // Check if already assigned
        const existing = await this.prisma.classSubject.findFirst({
            where: {
                subjectId: data.subjectId,
                classId: data.classId,
            },
        });

        if (existing) {
            // Update teacher
            return this.prisma.classSubject.update({
                where: { id: existing.id },
                data: { teacherId: data.teacherId },
            });
        }

        // Create new assignment - teacherId is required
        return this.prisma.classSubject.create({
            data: {
                subjectId: data.subjectId,
                classId: data.classId,
                teacherId: data.teacherId,
            },
        });
    }

    async removeSubjectFromClass(subjectId: string, classId: string) {
        const classSubject = await this.prisma.classSubject.findFirst({
            where: {
                subjectId,
                classId,
            },
        });

        if (!classSubject) {
            throw new NotFoundException('Subject not assigned to this class');
        }

        return this.prisma.classSubject.delete({
            where: { id: classSubject.id },
        });
    }

    async assignTeacherToSubject(data: {
        subjectId: string;
        classId: string;
        teacherId: string;
    }) {
        const classSubject = await this.prisma.classSubject.findFirst({
            where: {
                subjectId: data.subjectId,
                classId: data.classId,
            },
        });

        if (!classSubject) {
            throw new NotFoundException('Subject not assigned to this class');
        }

        return this.prisma.classSubject.update({
            where: { id: classSubject.id },
            data: { teacherId: data.teacherId },
        });
    }

    async getSubjectsByClass(classId: string) {
        return this.prisma.classSubject.findMany({
            where: { classId },
            include: {
                subject: true,
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
        });
    }
}
