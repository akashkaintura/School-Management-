import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClassesService {
    constructor(private prisma: PrismaService) { }

    async findAll(schoolId: string) {
        return this.prisma.class.findMany({
            where: { schoolId: schoolId },
            include: {
                _count: {
                    select: {
                        students: true,
                    },
                },
            },
            orderBy: [
                { name: 'asc' },
                { section: 'asc' },
            ],
        });
    }

    async findOne(id: string, schoolId: string) {
        return this.prisma.class.findFirst({
            where: {
                id,
                schoolId: schoolId
            },
            include: {
                students: {
                    include: {
                        user: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        students: true,
                    },
                },
            },
        });
    }

    async create(data: any) {
        return this.prisma.class.create({
            data,
        });
    }

    async update(id: string, data: any) {
        return this.prisma.class.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.class.delete({
            where: { id },
        });
    }
}
