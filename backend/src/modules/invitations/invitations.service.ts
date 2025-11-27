import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { InvitationStatus } from '@prisma/client';

@Injectable()
export class InvitationsService {
    constructor(private prisma: PrismaService) { }

    async createInvitation(
        schoolId: string,
        invitedBy: string,
        createInvitationDto: CreateInvitationDto,
    ) {
        const { email, role } = createInvitationDto;

        // Check if user already exists in this school
        const existingUser = await this.prisma.user.findFirst({
            where: {
                email,
                schoolId,
            },
        });

        if (existingUser) {
            throw new BadRequestException(
                'User with this email already exists in your school',
            );
        }

        // Check if there's already a pending invitation
        const existingInvitation = await this.prisma.invitation.findFirst({
            where: {
                email,
                schoolId,
                status: InvitationStatus.PENDING,
            },
        });

        if (existingInvitation) {
            throw new BadRequestException(
                'An invitation has already been sent to this email',
            );
        }

        // Create invitation (expires in 7 days)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const invitation = await this.prisma.invitation.create({
            data: {
                email,
                schoolId,
                role,
                invitedBy,
                expiresAt,
            },
            include: {
                school: {
                    select: {
                        name: true,
                        code: true,
                    },
                },
            },
        });

        // TODO: Send invitation email
        // await this.emailService.sendInvitation(invitation);

        return invitation;
    }

    async getInvitationsBySchool(schoolId: string) {
        return this.prisma.invitation.findMany({
            where: { schoolId },
            include: {
                school: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async validateInvitation(token: string) {
        const invitation = await this.prisma.invitation.findUnique({
            where: { token },
            include: {
                school: true,
            },
        });

        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            throw new BadRequestException('This invitation has already been used');
        }

        if (new Date() > invitation.expiresAt) {
            // Mark as expired
            await this.prisma.invitation.update({
                where: { id: invitation.id },
                data: { status: InvitationStatus.EXPIRED },
            });
            throw new BadRequestException('This invitation has expired');
        }

        return invitation;
    }

    async acceptInvitation(token: string, userId: string) {
        const invitation = await this.validateInvitation(token);

        // Update invitation status
        await this.prisma.invitation.update({
            where: { id: invitation.id },
            data: { status: InvitationStatus.ACCEPTED },
        });

        // Update user with school and role
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                schoolId: invitation.schoolId,
                role: invitation.role,
            },
            include: {
                profile: true,
                school: true,
            },
        });

        return user;
    }

    async revokeInvitation(invitationId: string, schoolId: string) {
        const invitation = await this.prisma.invitation.findFirst({
            where: {
                id: invitationId,
                schoolId,
            },
        });

        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            throw new BadRequestException('Can only revoke pending invitations');
        }

        return this.prisma.invitation.update({
            where: { id: invitationId },
            data: { status: InvitationStatus.REVOKED },
        });
    }

    async resendInvitation(invitationId: string, schoolId: string) {
        const invitation = await this.prisma.invitation.findFirst({
            where: {
                id: invitationId,
                schoolId,
            },
            include: {
                school: true,
            },
        });

        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            throw new BadRequestException('Can only resend pending invitations');
        }

        if (new Date() > invitation.expiresAt) {
            // Extend expiration by 7 days
            const newExpiresAt = new Date();
            newExpiresAt.setDate(newExpiresAt.getDate() + 7);

            await this.prisma.invitation.update({
                where: { id: invitationId },
                data: { expiresAt: newExpiresAt },
            });
        }

        // TODO: Resend invitation email
        // await this.emailService.sendInvitation(invitation);

        return { message: 'Invitation resent successfully' };
    }
}
