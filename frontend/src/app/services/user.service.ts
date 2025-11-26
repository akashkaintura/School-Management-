import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
    id: string;
    email: string;
    role: string;
    profile: {
        firstName: string;
        lastName: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    getById(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }
}
