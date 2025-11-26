import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ParentsService {
    constructor(private prisma: PrismaService) { }

    async getAllParents() {
        return this.prisma.user.findMany({
            where: { role: 'PARENT' },
            include: {
                profile: true,
                parent: {
                    include: {
                        students: {
                            include: {
                                user: {
                                    include: {
                                        profile: true,
                                    },
                                },
                                class: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getParentById(id: string) {
        return this.prisma.user.findFirst({
            where: {
                id,
                role: 'PARENT',
            },
            include: {
                profile: true,
                parent: {
                    include: {
                        students: {
                            include: {
                                user: {
                                    include: {
                                        profile: true,
                                    },
                                },
                                class: true,
                            },
                        },
                    },
                },
            },
        });
    }
}
