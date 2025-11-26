import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Board } from '@prisma/client';

@Injectable()
export class SchoolsService {
    constructor(private prisma: PrismaService) { }

    async getSchoolById(schoolId: string) {
        const school = await this.prisma.school.findUnique({
            where: { id: schoolId },
            include: {
                _count: {
                    select: { classes: true },
                },
            },
        });

        if (!school) {
            throw new NotFoundException('School not found');
        }

        return school;
    }

    async updateSchool(schoolId: string, data: {
        name?: string;
        code?: string;
        address?: string;
        city?: string;
        state?: string;
        pincode?: string;
        phone?: string;
        email?: string;
        principalName?: string;
    }) {
        return this.prisma.school.update({
            where: { id: schoolId },
            data,
        });
    }

    async updateBoard(schoolId: string, board: Board) {
        return this.prisma.school.update({
            where: { id: schoolId },
            data: { board },
        });
    }

    async updateLogo(schoolId: string, logo: string) {
        return this.prisma.school.update({
            where: { id: schoolId },
            data: { logo },
        });
    }

    async getSchoolByUserId(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { school: true },
        });

        if (!user || !user.schoolId) {
            throw new NotFoundException('User not associated with any school');
        }

        return user.school;
    }
}
