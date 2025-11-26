import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Teacher {
    id: string;
    email: string;
    profile: {
        firstName: string;
        lastName: string;
        phone: string;
    };
    teacher: {
        employeeId: string;
        qualification: string;
        specialization: string;
        experience: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class TeacherService {
    private apiUrl = `${environment.apiUrl}/teachers`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Teacher[]> {
        return this.http.get<Teacher[]>(this.apiUrl);
    }

    getById(id: string): Observable<Teacher> {
        return this.http.get<Teacher>(`${this.apiUrl}/${id}`);
    }
}
