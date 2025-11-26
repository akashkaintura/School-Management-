import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Board } from '@prisma/client';

@Injectable()
export class SuperAdminService {
    constructor(private prisma: PrismaService) { }

    async createSchool(data: {
        name: string;
        code: string;
        board: Board;
        address: string;
        city: string;
        state: string;
        pincode: string;
        phone: string;
        email: string;
        principalName: string;
        principalEmail: string;
    }) {
        // 1. Create School
        const school = await this.prisma.school.create({
            data: {
                name: data.name,
                code: data.code,
                board: data.board,
                address: data.address,
                city: data.city,
                state: data.state,
                pincode: data.pincode,
                phone: data.phone,
                email: data.email,
                principalName: data.principalName,
            },
        });

        // 2. Create Default Classes (1-12)
        const classes: any[] = [];
        for (let i = 1; i <= 12; i++) {
            classes.push({
                name: i.toString(),
                section: 'A',
                academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
                schoolId: school.id
            });
        }
        await this.prisma.class.createMany({ data: classes });

        return school;
    }

    async getAllSchools() {
        return this.prisma.school.findMany({
            include: {
                _count: {
                    select: { classes: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getSchoolStats() {
        const [totalSchools, totalUsers, totalStudents, totalTeachers] = await Promise.all([
            this.prisma.school.count(),
            this.prisma.user.count(),
            this.prisma.student.count(),
            this.prisma.teacher.count(),
        ]);

        return {
            totalSchools,
            totalUsers,
            totalStudents,
            totalTeachers,
        };
    }
}
