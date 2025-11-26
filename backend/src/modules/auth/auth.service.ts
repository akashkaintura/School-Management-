import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../../prisma/prisma.service';
import { GoogleLoginDto } from './dto/google-login.dto';

@Injectable()
export class AuthService {
    private googleClient: OAuth2Client;

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private prisma: PrismaService,
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
                include: { profile: true },
            });

            // If user doesn't exist, create a new one
            if (!user) {
                user = await this.prisma.user.create({
                    data: {
                        email,
                        password: '', // No password for Google users
                        role: 'STUDENT', // Default role, can be changed later
                        emailVerified: true,
                        profile: {
                            create: {
                                firstName: name?.split(' ')[0] || 'User',
                                lastName: name?.split(' ').slice(1).join(' ') || '',
                                avatar: picture || null,
                            },
                        },
                    },
                    include: { profile: true },
                });
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
                    profile: user.profile,
                },
            };
        } catch (error) {
            console.error('Google login error:', error);
            throw new UnauthorizedException('Invalid Google token');
        }
    }
}
