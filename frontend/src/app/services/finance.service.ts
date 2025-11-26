import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FeePayment {
    id: string;
    studentId: string;
    feeStructureId: string;
    amount: number;
    paymentDate: Date;
    paymentMethod: string;
    transactionId?: string;
    status: 'PAID' | 'PENDING' | 'OVERDUE';
    currency: string;
}

@Injectable({
    providedIn: 'root'
})
export class FinanceService {
    private apiUrl = `${environment.apiUrl}/finance`;

    constructor(private http: HttpClient) { }

    getAllPayments(): Observable<FeePayment[]> {
        return this.http.get<FeePayment[]>(`${this.apiUrl}/payments`);
    }

    getPaymentsByStudent(studentId: string): Observable<FeePayment[]> {
        return this.http.get<FeePayment[]>(`${this.apiUrl}/payments/student/${studentId}`);
    }

    createPayment(data: Partial<FeePayment>): Observable<FeePayment> {
        return this.http.post<FeePayment>(`${this.apiUrl}/payments`, data);
    }

    getFinanceStats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/stats`);
    }

    getFeeStructures(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/fee-structures`);
    }
}
