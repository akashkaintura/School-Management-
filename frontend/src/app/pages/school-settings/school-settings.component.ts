import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-school-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './school-settings.component.html',
    styleUrls: ['./school-settings.component.css']
})
export class SchoolSettingsComponent implements OnInit {
    activeTab: 'basic' | 'board' | 'branding' = 'basic';

    school: any = null;
    loading = false;
    saving = false;
    message = '';
    messageType: 'success' | 'error' = 'success';

    // Basic Info Form
    basicForm = {
        name: '',
        code: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        email: '',
        principalName: ''
    };

    // Board Form
    selectedBoard: string = '';
    boards = ['CBSE', 'ICSE', 'IB', 'STATE_BOARD'];

    // Logo Upload
    selectedFile: File | null = null;
    logoPreview: string | null = null;
    currentLogo: string | null = null;

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadSchoolData();
    }

    loadSchoolData() {
        this.loading = true;
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const schoolId = user.schoolId;

        if (!schoolId) {
            this.showMessage('No school associated with this account', 'error');
            this.loading = false;
            return;
        }

        this.http.get(`${environment.apiUrl}/schools/${schoolId}`).subscribe({
            next: (data: any) => {
                this.school = data;
                this.populateForms(data);
                this.loading = false;
            },
            error: (err) => {
                this.showMessage('Failed to load school data', 'error');
                this.loading = false;
            }
        });
    }

    populateForms(school: any) {
        this.basicForm = {
            name: school.name || '',
            code: school.code || '',
            address: school.address || '',
            city: school.city || '',
            state: school.state || '',
            pincode: school.pincode || '',
            phone: school.phone || '',
            email: school.email || '',
            principalName: school.principalName || ''
        };
        this.selectedBoard = school.board || '';
        this.currentLogo = school.logo ? `${environment.apiUrl.replace('/api', '')}${school.logo}` : null;
    }

    saveBasicInfo() {
        this.saving = true;
        this.http.put(`${environment.apiUrl}/schools/${this.school.id}`, this.basicForm).subscribe({
            next: () => {
                this.showMessage('School information updated successfully!', 'success');
                this.saving = false;
                this.loadSchoolData();
            },
            error: () => {
                this.showMessage('Failed to update school information', 'error');
                this.saving = false;
            }
        });
    }

    updateBoard() {
        if (!this.selectedBoard) {
            this.showMessage('Please select a board', 'error');
            return;
        }

        this.saving = true;
        this.http.put(`${environment.apiUrl}/schools/${this.school.id}/board`, { board: this.selectedBoard }).subscribe({
            next: () => {
                this.showMessage('Board affiliation updated successfully!', 'success');
                this.saving = false;
                this.loadSchoolData();
            },
            error: () => {
                this.showMessage('Failed to update board affiliation', 'error');
                this.saving = false;
            }
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.match(/image\/(jpg|jpeg|png|gif)/)) {
                this.showMessage('Only image files (JPG, PNG, GIF) are allowed', 'error');
                return;
            }

            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                this.showMessage('File size must be less than 2MB', 'error');
                return;
            }

            this.selectedFile = file;

            // Preview
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.logoPreview = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    uploadLogo() {
        if (!this.selectedFile) {
            this.showMessage('Please select a file first', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('logo', this.selectedFile);

        this.saving = true;
        this.http.post(`${environment.apiUrl}/schools/${this.school.id}/logo`, formData).subscribe({
            next: () => {
                this.showMessage('Logo uploaded successfully!', 'success');
                this.saving = false;
                this.selectedFile = null;
                this.logoPreview = null;
                this.loadSchoolData();
            },
            error: () => {
                this.showMessage('Failed to upload logo', 'error');
                this.saving = false;
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

    setActiveTab(tab: 'basic' | 'board' | 'branding') {
        this.activeTab = tab;
    }
}
