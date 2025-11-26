import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { Board } from '@prisma/client';

@Controller('super-admin')
export class SuperAdminController {
    constructor(private readonly superAdminService: SuperAdminService) { }

    @Post('schools')
    createSchool(@Body() data: {
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
        return this.superAdminService.createSchool(data);
    }

    @Get('schools')
    getAllSchools() {
        return this.superAdminService.getAllSchools();
    }

    @Get('stats')
    getStats() {
        return this.superAdminService.getSchoolStats();
    }
}
