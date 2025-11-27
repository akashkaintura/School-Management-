import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SchoolId } from '../../decorators/school-id.decorator';

@Controller('api/invitations')
@UseGuards(JwtAuthGuard)
export class InvitationsController {
    constructor(private readonly invitationsService: InvitationsService) { }

    @Post()
    create(
        @SchoolId() schoolId: string,
        @Request() req,
        @Body() createInvitationDto: CreateInvitationDto,
    ) {
        return this.invitationsService.createInvitation(
            schoolId,
            req.user.sub,
            createInvitationDto,
        );
    }

    @Get()
    findAll(@SchoolId() schoolId: string) {
        return this.invitationsService.getInvitationsBySchool(schoolId);
    }

    @Post(':id/resend')
    resend(@Param('id') id: string, @SchoolId() schoolId: string) {
        return this.invitationsService.resendInvitation(id, schoolId);
    }

    @Delete(':id')
    revoke(@Param('id') id: string, @SchoolId() schoolId: string) {
        return this.invitationsService.revokeInvitation(id, schoolId);
    }
}
