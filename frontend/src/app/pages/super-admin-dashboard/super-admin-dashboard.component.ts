import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-super-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './super-admin-dashboard.component.html',
    styleUrls: ['./super-admin-dashboard.component.css']
})
export class SuperAdminDashboardComponent implements OnInit {
    stats: any = null;
    schools: any[] = [];
    teacherApplications: any[] = [];
    loading = false;
    message = '';
    messageType: 'success' | 'error' = 'success';

    // Create School Modal
    showCreateSchoolModal = false;
    createSchoolForm = {
        name: '',
        code: '',
        board: 'CBSE',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        email: '',
        principalName: '',
        principalEmail: '',
        principalPassword: ''
    };

    boards = ['CBSE', 'ICSE', 'IB', 'STATE_BOARD'];

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadStats();
        this.loadSchools();
        this.loadTeacherApplications();
    }

    loadStats() {
        this.http.get(`${environment.apiUrl}/super-admin/stats`).subscribe({
            next: (data: any) => {
                this.stats = data;
            },
            error: () => {
                this.showMessage('Failed to load statistics', 'error');
            }
        });
    }

    loadSchools() {
        this.loading = true;
        this.http.get<any[]>(`${environment.apiUrl}/super-admin/schools`).subscribe({
            next: (data) => {
                this.schools = data;
                this.loading = false;
            },
            error: () => {
                this.showMessage('Failed to load schools', 'error');
                this.loading = false;
            }
        });
    }

    loadTeacherApplications() {
        // This will be implemented when we create the teacher applications API
        // For now, just set to empty array
        this.teacherApplications = [];
    }

    openCreateSchoolModal() {
        this.createSchoolForm = {
            name: '',
            code: '',
            board: 'CBSE',
            address: '',
            city: '',
            state: '',
            pincode: '',
            phone: '',
            email: '',
            principalName: '',
            principalEmail: '',
            principalPassword: ''
        };
        this.showCreateSchoolModal = true;
    }

    closeCreateSchoolModal() {
        this.showCreateSchoolModal = false;
    }

    createSchool() {
        if (!this.createSchoolForm.name || !this.createSchoolForm.code) {
            this.showMessage('Name and code are required', 'error');
            return;
        }

        this.http.post(`${environment.apiUrl}/super-admin/schools`, this.createSchoolForm).subscribe({
            next: () => {
                this.showMessage('School created successfully!', 'success');
                this.closeCreateSchoolModal();
                this.loadSchools();
                this.loadStats();
            },
            error: () => {
                this.showMessage('Failed to create school', 'error');
            }
        });
    }

    showMessage(msg: string, type: 'success' | 'error') {
        this.message = msg;
        this.messageType = type;
        setTimeout(() => {
            this.message = '';
        }, 5000);
    }
}
