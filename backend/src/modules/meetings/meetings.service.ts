import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MeetingType, MeetingStatus } from '@prisma/client';

@Injectable()
export class MeetingsService {
    constructor(private prisma: PrismaService) { }

    async createMeeting(data: {
        title: string;
        description?: string;
        type: MeetingType;
        scheduledAt: Date;
        duration: number;
        createdBy: string;
        location?: string;
        meetingLink?: string;
    }) {
        return this.prisma.meeting.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                scheduledAt: new Date(data.scheduledAt),
                duration: data.duration,
                createdBy: data.createdBy,
                location: data.location,
                meetingLink: data.meetingLink,
                status: 'SCHEDULED',
            },
        });
    }

    async getAllMeetings() {
        return this.prisma.meeting.findMany({
            include: {
                participants: {
                    include: {
                        user: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                scheduledAt: 'desc',
            },
        });
    }

    async getMeetingsByUser(userId: string) {
        return this.prisma.meeting.findMany({
            where: {
                participants: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                participants: {
                    include: {
                        user: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                scheduledAt: 'desc',
            },
        });
    }
}
