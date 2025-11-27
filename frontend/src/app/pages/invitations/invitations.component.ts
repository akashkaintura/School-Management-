import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvitationService, Invitation, CreateInvitationDto } from '../../services/invitation.service';

@Component({
    selector: 'app-invitations',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './invitations.component.html',
    styleUrls: ['./invitations.component.css']
})
export class InvitationsComponent implements OnInit {
    invitations: Invitation[] = [];
    loading = false;
    showModal = false;
    copiedToken: string | null = null;

    newInvitation: CreateInvitationDto = {
        email: '',
        role: 'STUDENT',
        message: ''
    };

    roles = [
        { value: 'STUDENT', label: 'Student' },
        { value: 'TEACHER', label: 'Teacher' },
        { value: 'PARENT', label: 'Parent' },
        { value: 'ADMIN', label: 'Admin' },
        { value: 'PRINCIPAL', label: 'Principal' },
        { value: 'FINANCE', label: 'Finance' }
    ];

    constructor(private invitationService: InvitationService) { }

    ngOnInit() {
        this.loadInvitations();
    }

    loadInvitations() {
        this.loading = true;
        this.invitationService.getInvitations().subscribe({
            next: (data) => {
                this.invitations = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading invitations:', error);
                this.loading = false;
            }
        });
    }

    openModal() {
        this.showModal = true;
        this.newInvitation = {
            email: '',
            role: 'STUDENT',
            message: ''
        };
    }

    closeModal() {
        this.showModal = false;
    }

    createInvitation() {
        if (!this.newInvitation.email || !this.newInvitation.role) {
            return;
        }

        this.loading = true;
        this.invitationService.createInvitation(this.newInvitation).subscribe({
            next: (invitation) => {
                this.invitations.unshift(invitation);
                this.closeModal();
                this.loading = false;
                // Show success message
                alert('Invitation created successfully!');
            },
            error: (error) => {
                console.error('Error creating invitation:', error);
                alert(error.error?.message || 'Failed to create invitation');
                this.loading = false;
            }
        });
    }

    copyInvitationLink(token: string) {
        const link = this.invitationService.getInvitationLink(token);
        navigator.clipboard.writeText(link).then(() => {
            this.copiedToken = token;
            setTimeout(() => {
                this.copiedToken = null;
            }, 2000);
        });
    }

    resendInvitation(id: string) {
        this.invitationService.resendInvitation(id).subscribe({
            next: () => {
                alert('Invitation resent successfully!');
            },
            error: (error) => {
                console.error('Error resending invitation:', error);
                alert('Failed to resend invitation');
            }
        });
    }

    revokeInvitation(id: string) {
        if (!confirm('Are you sure you want to revoke this invitation?')) {
            return;
        }

        this.invitationService.revokeInvitation(id).subscribe({
            next: () => {
                this.loadInvitations();
                alert('Invitation revoked successfully!');
            },
            error: (error) => {
                console.error('Error revoking invitation:', error);
                alert('Failed to revoke invitation');
            }
        });
    }

    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'ACCEPTED':
                return 'bg-green-100 text-green-800';
            case 'EXPIRED':
                return 'bg-red-100 text-red-800';
            case 'REVOKED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    isExpired(expiresAt: string): boolean {
        return new Date(expiresAt) < new Date();
    }
}
