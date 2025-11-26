import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FinanceService {
    constructor(private prisma: PrismaService) { }

    async getAllPayments() {
        return this.prisma.feePayment.findMany({
            include: {
                student: {
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
                paymentDate: 'desc',
            },
        });
    }

    async getPaymentsByStudent(studentId: string) {
        return this.prisma.feePayment.findMany({
            where: { studentId },
            orderBy: {
                paymentDate: 'desc',
            },
        });
    }

    async createPayment(data: any) {
        return this.prisma.feePayment.create({
            data: {
                studentId: data.studentId,
                feeType: data.feeType || 'Tuition Fee',
                term: data.term || 'MONTHLY',
                amount: data.amount,
                paymentDate: new Date(data.paymentDate),
                paymentMethod: data.paymentMethod,
                transactionId: data.transactionId,
                status: data.status || 'COMPLETED',
                currency: data.currency || 'INR',
            },
            include: {
                student: {
                    include: {
                        user: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async getFinanceStats() {
        const totalCollected = await this.prisma.feePayment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: {
                amount: true,
            },
        });

        const totalPending = await this.prisma.feePayment.aggregate({
            where: { status: 'PENDING' },
            _sum: {
                amount: true,
            },
        });

        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);

        const monthlyCollection = await this.prisma.feePayment.aggregate({
            where: {
                status: 'COMPLETED',
                paymentDate: {
                    gte: thisMonth,
                },
            },
            _sum: {
                amount: true,
            },
        });

        return {
            totalCollected: totalCollected._sum?.amount || 0,
            totalPending: totalPending._sum?.amount || 0,
            monthlyCollection: monthlyCollection._sum?.amount || 0,
        };
    }

    async getFeeStructures() {
        return this.prisma.feeStructure.findMany({
            include: {
                class: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}
