import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GoogleLoginDto {
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsOptional()
    @IsString()
    invitationToken?: string;
}
