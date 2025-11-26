import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Student {
    id: string;
    email: string;
    profile: {
        firstName: string;
        lastName: string;
        phone: string;
    };
    student: {
        rollNumber: string;
        admissionNumber: string;
        class: {
            name: string;
            section: string;
        };
    };
}

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    private apiUrl = `${environment.apiUrl}/students`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Student[]> {
        return this.http.get<Student[]>(this.apiUrl);
    }

    getById(id: string): Observable<Student> {
        return this.http.get<Student>(`${this.apiUrl}/${id}`);
    }
}
