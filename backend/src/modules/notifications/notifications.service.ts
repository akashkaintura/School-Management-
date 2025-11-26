import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async createNotification(data: {
        title: string;
        message: string;
        type: NotificationType;
        userId: string;
        link?: string;
    }) {
        return this.prisma.notification.create({
            data: {
                title: data.title,
                message: data.message,
                type: data.type,
                userId: data.userId,
                link: data.link,
                isRead: false,
            },
        });
    }

    async getAllNotifications() {
        return this.prisma.notification.findMany({
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getNotificationsByUser(userId: string) {
        return this.prisma.notification.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async markAsRead(id: string) {
        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }
}
