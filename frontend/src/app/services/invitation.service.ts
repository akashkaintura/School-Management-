import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Invitation {
    id: string;
    email: string;
    role: string;
    status: string;
    token: string;
    expiresAt: string;
    createdAt: string;
    school?: {
        name: string;
    };
}

export interface CreateInvitationDto {
    email: string;
    role: string;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class InvitationService {
    private apiUrl = `${environment.apiUrl}/invitations`;

    constructor(private http: HttpClient) { }

    createInvitation(data: CreateInvitationDto): Observable<Invitation> {
        return this.http.post<Invitation>(this.apiUrl, data);
    }

    getInvitations(): Observable<Invitation[]> {
        return this.http.get<Invitation[]>(this.apiUrl);
    }

    resendInvitation(id: string): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.apiUrl}/${id}/resend`, {});
    }

    revokeInvitation(id: string): Observable<Invitation> {
        return this.http.delete<Invitation>(`${this.apiUrl}/${id}`);
    }

    getInvitationLink(token: string): string {
        return `${window.location.origin}/auth/accept-invitation?token=${token}`;
    }
}
