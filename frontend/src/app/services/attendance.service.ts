import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AttendanceRecord {
    id: string;
    studentId: string;
    classId: string;
    date: Date;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
    remarks?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AttendanceService {
    private apiUrl = `${environment.apiUrl}/attendance`;

    constructor(private http: HttpClient) { }

    markAttendance(data: Partial<AttendanceRecord>): Observable<AttendanceRecord> {
        return this.http.post<AttendanceRecord>(this.apiUrl, data);
    }

    getAttendanceByClass(classId: string, date?: string): Observable<AttendanceRecord[]> {
        const url = date ? `${this.apiUrl}/class/${classId}?date=${date}` : `${this.apiUrl}/class/${classId}`;
        return this.http.get<AttendanceRecord[]>(url);
    }

    getAttendanceByStudent(studentId: string): Observable<AttendanceRecord[]> {
        return this.http.get<AttendanceRecord[]>(`${this.apiUrl}/student/${studentId}`);
    }

    getAttendanceStats(studentId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/student/${studentId}/stats`);
    }
}
