import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { SchoolId } from '../../decorators/school-id.decorator';

@ApiTags('invitations')
@ApiBearerAuth('JWT-auth')
@Controller('api/invitations')
export class InvitationsController {
    constructor(private readonly invitationsService: InvitationsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new invitation' })
    @ApiResponse({ status: 201, description: 'Invitation created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
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
