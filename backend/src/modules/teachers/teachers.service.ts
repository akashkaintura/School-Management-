import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TeachersService {
    constructor(private prisma: PrismaService) { }

    async findAll(schoolId: string) {
        return this.prisma.user.findMany({
            where: {
                role: 'TEACHER',
                schoolId: schoolId
            },
            include: {
                profile: true,
                teacher: true,
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
                role: 'TEACHER',
                schoolId: schoolId
            },
            include: {
                profile: true,
                teacher: true,
            },
        });
    }
}
