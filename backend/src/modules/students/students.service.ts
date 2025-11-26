import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StudentsService {
    constructor(private prisma: PrismaService) { }

    async findAll(schoolId: string) {
        return this.prisma.user.findMany({
            where: {
                role: 'STUDENT',
                schoolId: schoolId
            },
            include: {
                profile: true,
                student: {
                    include: {
                        class: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string, schoolId: string) {
        return this.prisma.user.findFirst({
            where: {
                id,
                role: 'STUDENT',
                schoolId: schoolId
            },
            include: {
                profile: true,
                student: {
                    include: {
                        class: true,
                    },
                },
            },
        });
    }
}
