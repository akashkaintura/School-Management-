import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
    accessToken: string;
    user: {
        id: string;
        email: string;
        role: string;
        profile: any;
    };
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    googleLogin(token: string, invitationToken?: string | null): Observable<AuthResponse> {
        const body: any = { token };
        if (invitationToken) {
            body.invitationToken = invitationToken;
        }
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/google`, body);
    }

    saveToken(token: string): void {
        localStorage.setItem('access_token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    saveUser(user: any): void {
        localStorage.setItem('current_user', JSON.stringify(user));
    }

    getUser(): any {
        const user = localStorage.getItem('current_user');
        return user ? JSON.parse(user) : null;
    }

    getUserRole(): string | null {
        const user = this.getUser();
        return user ? user.role : null;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('current_user');
    }
}
