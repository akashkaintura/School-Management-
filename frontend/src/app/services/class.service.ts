import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Class {
    id: string;
    name: string;
    section: string;
    academicYear: string;
    capacity: number;
    roomNumber: string;
    _count?: {
        students: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class ClassService {
    private apiUrl = `${environment.apiUrl}/classes`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Class[]> {
        return this.http.get<Class[]>(this.apiUrl);
    }

    getById(id: string): Observable<Class> {
        return this.http.get<Class>(`${this.apiUrl}/${id}`);
    }

    create(classData: Partial<Class>): Observable<Class> {
        return this.http.post<Class>(this.apiUrl, classData);
    }

    update(id: string, classData: Partial<Class>): Observable<Class> {
        return this.http.put<Class>(`${this.apiUrl}/${id}`, classData);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
