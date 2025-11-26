import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ResultsService {
    private apiUrl = `${environment.apiUrl}/results`;

    constructor(private http: HttpClient) { }

    createResult(data: any): Observable<any> {
        return this.http.post(this.apiUrl, data);
    }

    getResultsByStudent(studentId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/student/${studentId}`);
    }

    getResultsByExam(examId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/exam/${examId}`);
    }

    uploadResults(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/upload`, formData);
    }
}
