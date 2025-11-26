import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Board } from '@prisma/client';

@Injectable()
export class RegistrationService {
    constructor(private prisma: PrismaService) { }

    async registerSchool(data: {
        schoolName: string;
        schoolCode: string;
        board: Board;
        address: string;
        city: string;
        state: string;
        pincode: string;
        phone: string;
        email: string;
        password: string;
        principalName: string;
    }) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // 1. Create School
        const school = await this.prisma.school.create({
            data: {
                name: data.schoolName,
                code: data.schoolCode,
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

        // 2. Create Principal User
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: 'PRINCIPAL',
                schoolId: school.id,
                emailVerified: false,
                profile: {
                    create: {
                        firstName: data.principalName.split(' ')[0],
                        lastName: data.principalName.split(' ').slice(1).join(' ') || '',
                        phone: data.phone,
                    },
                },
            },
        });

        return { school, user };
    }

    async registerTeacher(data: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        schoolId: string;
        subjects: string[];
        experience: number;
        qualification: string;
    }) {
        return this.prisma.teacherApplication.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                schoolId: data.schoolId,
                subjects: data.subjects,
                experience: data.experience,
                qualification: data.qualification,
                status: 'PENDING',
            },
        });
    }

    async getSchools() {
        return this.prisma.school.findMany({
            select: {
                id: true,
                name: true,
                city: true,
                board: true,
            },
        });
    }
}
