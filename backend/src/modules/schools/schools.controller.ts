import {
    Controller,
    Get,
    Put,
    Post,
    Body,
    Param,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SchoolsService } from './schools.service';
import { Board } from '@prisma/client';

@Controller('schools')
export class SchoolsController {
    constructor(private readonly schoolsService: SchoolsService) { }

    @Get(':id')
    getSchool(@Param('id') id: string) {
        return this.schoolsService.getSchoolById(id);
    }

    @Put(':id')
    updateSchool(
        @Param('id') id: string,
        @Body() updateData: {
            name?: string;
            code?: string;
            address?: string;
            city?: string;
            state?: string;
            pincode?: string;
            phone?: string;
            email?: string;
            principalName?: string;
        },
    ) {
        return this.schoolsService.updateSchool(id, updateData);
    }

    @Put(':id/board')
    updateBoard(
        @Param('id') id: string,
        @Body() data: { board: Board },
    ) {
        return this.schoolsService.updateBoard(id, data.board);
    }

    @Post(':id/logo')
    @UseInterceptors(
        FileInterceptor('logo', {
            storage: diskStorage({
                destination: './uploads/logos',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    cb(null, `school-${req.params.id}-${uniqueSuffix}${ext}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                    return cb(new BadRequestException('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 2 * 1024 * 1024, // 2MB
            },
        }),
    )
    async uploadLogo(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const logoUrl = `/uploads/logos/${file.filename}`;
        return this.schoolsService.updateLogo(id, logoUrl);
    }
}
