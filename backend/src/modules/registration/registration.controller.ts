import { Controller, Post, Body, Get } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { Board } from '@prisma/client';

@Controller('register')
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) { }

    @Post('school')
    registerSchool(@Body() data: {
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
        return this.registrationService.registerSchool(data);
    }

    @Post('teacher')
    registerTeacher(@Body() data: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        schoolId: string;
        subjects: string[];
        experience: number;
        qualification: string;
    }) {
        return this.registrationService.registerTeacher(data);
    }

    @Get('schools')
    getSchools() {
        return this.registrationService.getSchools();
    }
}
