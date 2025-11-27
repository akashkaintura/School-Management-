import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateInvitationDto {
    @ApiProperty({ example: 'user@example.com', description: 'Email address of the person to invite' })
    @IsEmail()
    email: string;

    @ApiProperty({ enum: Role, example: 'TEACHER', description: 'Role to assign to the invited user' })
    @IsEnum(Role)
    role: Role;

    @ApiPropertyOptional({ example: 'Welcome to our school!', description: 'Optional message to include in the invitation email' })
    @IsOptional()
    @IsString()
    message?: string;
}
