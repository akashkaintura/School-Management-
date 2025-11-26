import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-subject-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './subject-management.component.html',
    styleUrls: ['./subject-management.component.css']
})
export class SubjectManagementComponent implements OnInit {
    subjects: any[] = [];
    classes: any[] = [];
    teachers: any[] = [];
    loading = false;
    message = '';
    messageType: 'success' | 'error' = 'success';

    // Filters
    selectedBoardFilter: string = '';
    searchTerm: string = '';
    boards = ['CBSE', 'ICSE', 'IB', 'STATE_BOARD'];

    // Modals
    showCreateModal = false;
    showEditModal = false;
    showAssignModal = false;
    showDeleteModal = false;

    // Forms
    createForm = {
        name: '',
        code: '',
        board: '',
        description: ''
    };

    editForm = {
        id: '',
        name: '',
        code: '',
        board: '',
        description: ''
    };

    assignForm = {
        subjectId: '',
        classId: '',
        teacherId: ''
    };

    selectedSubject: any = null;
    deleteSubjectId: string = '';

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadSubjects();
        this.loadClasses();
        this.loadTeachers();
    }

    loadSubjects() {
        this.loading = true;
        const url = this.selectedBoardFilter
            ? `${environment.apiUrl}/subjects?board=${this.selectedBoardFilter}`
            : `${environment.apiUrl}/subjects`;

        this.http.get<any[]>(url).subscribe({
            next: (data) => {
                this.subjects = data;
                this.loading = false;
            },
            error: () => {
                this.showMessage('Failed to load subjects', 'error');
                this.loading = false;
            }
        });
    }

    loadClasses() {
        this.http.get<any[]>(`${environment.apiUrl}/classes`).subscribe({
            next: (data) => {
                this.classes = data;
            },
            error: () => {
                console.error('Failed to load classes');
            }
        });
    }

    loadTeachers() {
        this.http.get<any[]>(`${environment.apiUrl}/teachers`).subscribe({
            next: (data) => {
                this.teachers = data;
            },
            error: () => {
                console.error('Failed to load teachers');
            }
        });
    }

    get filteredSubjects() {
        return this.subjects.filter(subject => {
            const matchesSearch = !this.searchTerm ||
                subject.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                subject.code.toLowerCase().includes(this.searchTerm.toLowerCase());
            return matchesSearch;
        });
    }

    openCreateModal() {
        this.createForm = { name: '', code: '', board: '', description: '' };
        this.showCreateModal = true;
    }

    closeCreateModal() {
        this.showCreateModal = false;
    }

    createSubject() {
        if (!this.createForm.name || !this.createForm.code) {
            this.showMessage('Name and code are required', 'error');
            return;
        }

        this.http.post(`${environment.apiUrl}/subjects`, this.createForm).subscribe({
            next: () => {
                this.showMessage('Subject created successfully!', 'success');
                this.closeCreateModal();
                this.loadSubjects();
            },
            error: () => {
                this.showMessage('Failed to create subject', 'error');
            }
        });
    }

    openEditModal(subject: any) {
        this.editForm = {
            id: subject.id,
            name: subject.name,
            code: subject.code,
            board: subject.board || '',
            description: subject.description || ''
        };
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
    }

    updateSubject() {
        const { id, ...data } = this.editForm;
        this.http.put(`${environment.apiUrl}/subjects/${id}`, data).subscribe({
            next: () => {
                this.showMessage('Subject updated successfully!', 'success');
                this.closeEditModal();
                this.loadSubjects();
            },
            error: () => {
                this.showMessage('Failed to update subject', 'error');
            }
        });
    }

    openAssignModal(subject: any) {
        this.selectedSubject = subject;
        this.assignForm = { subjectId: subject.id, classId: '', teacherId: '' };
        this.showAssignModal = true;
    }

    closeAssignModal() {
        this.showAssignModal = false;
        this.selectedSubject = null;
    }

    assignToClass() {
        if (!this.assignForm.classId || !this.assignForm.teacherId) {
            this.showMessage('Please select both class and teacher', 'error');
            return;
        }

        this.http.post(`${environment.apiUrl}/subjects/${this.assignForm.subjectId}/assign-class`, {
            classId: this.assignForm.classId,
            teacherId: this.assignForm.teacherId
        }).subscribe({
            next: () => {
                this.showMessage('Subject assigned to class successfully!', 'success');
                this.closeAssignModal();
                this.loadSubjects();
            },
            error: () => {
                this.showMessage('Failed to assign subject', 'error');
            }
        });
    }

    openDeleteModal(subjectId: string) {
        this.deleteSubjectId = subjectId;
        this.showDeleteModal = true;
    }

    closeDeleteModal() {
        this.showDeleteModal = false;
        this.deleteSubjectId = '';
    }

    deleteSubject() {
        this.http.delete(`${environment.apiUrl}/subjects/${this.deleteSubjectId}`).subscribe({
            next: () => {
                this.showMessage('Subject deleted successfully!', 'success');
                this.closeDeleteModal();
                this.loadSubjects();
            },
            error: () => {
                this.showMessage('Failed to delete subject', 'error');
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

    filterByBoard() {
        this.loadSubjects();
    }
}
