import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FinanceService } from './finance.service';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) { }

  @Get('payments')
  getAllPayments() {
    return this.financeService.getAllPayments();
  }

  @Get('payments/student/:studentId')
  getPaymentsByStudent(@Param('studentId') studentId: string) {
    return this.financeService.getPaymentsByStudent(studentId);
  }

  @Post('payments')
  createPayment(@Body() createPaymentDto: any) {
    return this.financeService.createPayment(createPaymentDto);
  }

  @Get('stats')
  getFinanceStats() {
    return this.financeService.getFinanceStats();
  }

  @Get('fee-structures')
  getFeeStructures() {
    return this.financeService.getFeeStructures();
  }
}
