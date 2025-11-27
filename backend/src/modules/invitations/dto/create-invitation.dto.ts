import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateInvitationDto {
    @IsEmail()
    email: string;

    @IsEnum(Role)
    role: Role;

    @IsOptional()
    @IsString()
    message?: string;
}
