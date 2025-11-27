import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../../prisma/prisma.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
    private googleClient: OAuth2Client;

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private prisma: PrismaService,
        private emailService: EmailService,
    ) {
        this.googleClient = new OAuth2Client(
            this.configService.get<string>('GOOGLE_CLIENT_ID'),
        );
    }

    async googleLogin(googleLoginDto: GoogleLoginDto) {
        try {
            // Verify the Google token
            const ticket = await this.googleClient.verifyIdToken({
                idToken: googleLoginDto.token,
                audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
            });

            const payload = ticket.getPayload();
            if (!payload) {
                throw new UnauthorizedException('Invalid Google token');
            }

            const { email, name, picture, sub: googleId } = payload;

            if (!email) {
                throw new UnauthorizedException('Email not provided by Google');
            }

            // Check if user exists
            let user = await this.prisma.user.findUnique({
                where: { email },
                include: { profile: true, school: true },
            });

            // If user doesn't exist, they MUST have a valid invitation
            if (!user) {
                const invitationToken = googleLoginDto.invitationToken;

                if (!invitationToken) {
                    // Send email to user informing them they need an invitation
                    await this.emailService.sendInvitationRequiredEmail(email);

                    throw new UnauthorizedException(
                        'You must be invited to join a school. Please contact your school administrator. We\'ve sent you an email with more information.',
                    );
                }

                // Validate invitation
                const invitation = await this.prisma.invitation.findUnique({
                    where: { token: invitationToken },
                    include: { school: true },
                });

                if (!invitation) {
                    throw new UnauthorizedException('Invalid invitation token');
                }

                if (invitation.status !== 'PENDING') {
                    throw new UnauthorizedException('This invitation has already been used');
                }

                if (new Date() > invitation.expiresAt) {
                    await this.prisma.invitation.update({
                        where: { id: invitation.id },
                        data: { status: 'EXPIRED' },
                    });
                    throw new UnauthorizedException('This invitation has expired');
                }

                if (invitation.email.toLowerCase() !== email.toLowerCase()) {
                    throw new UnauthorizedException(
                        'This invitation was sent to a different email address',
                    );
                }

                // Create user with school and role from invitation
                user = await this.prisma.user.create({
                    data: {
                        email,
                        password: '', // No password for Google users
                        role: invitation.role,
                        schoolId: invitation.schoolId,
                        emailVerified: true,
                        profile: {
                            create: {
                                firstName: name?.split(' ')[0] || 'User',
                                lastName: name?.split(' ').slice(1).join(' ') || '',
                                avatar: picture || null,
                            },
                        },
                    },
                    include: { profile: true, school: true },
                });

                // Mark invitation as accepted
                await this.prisma.invitation.update({
                    where: { id: invitation.id },
                    data: { status: 'ACCEPTED' },
                });
            } else {
                // Existing user MUST have a schoolId
                if (!user.schoolId) {
                    throw new UnauthorizedException(
                        'Your account is not associated with any school. Please contact support.',
                    );
                }
            }

            if (!user) {
                throw new UnauthorizedException('Failed to create user');
            }

            // Generate JWT token
            const accessToken = this.jwtService.sign({
                sub: user.id,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId,
            });

            return {
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    schoolId: user.schoolId,
                    school: user.school,
                    profile: user.profile,
                },
            };
        } catch (error) {
            console.error('Google login error:', error);
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('Invalid Google token');
        }
    }
}
