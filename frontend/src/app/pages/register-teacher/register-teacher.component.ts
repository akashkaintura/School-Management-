import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-register-teacher',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './register-teacher.component.html',
})
export class RegisterTeacherComponent implements OnInit {
    teacherData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        schoolId: '',
        subjects: [] as string[],
        experience: 0,
        qualification: '',
    };

    schools: any[] = [];
    availableSubjects = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science', 'Physics', 'Chemistry', 'Biology'];
    selectedSubjects: { [key: string]: boolean } = {};

    isLoading = false;
    error = '';

    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit() {
        this.fetchSchools();
    }

    fetchSchools() {
        this.http.get('http://localhost:3000/register/schools').subscribe({
            next: (res: any) => {
                this.schools = res;
            },
            error: (err) => {
                console.error('Failed to fetch schools', err);
            }
        });
    }

    onSubjectChange(subject: string, event: any) {
        if (event.target.checked) {
            this.teacherData.subjects.push(subject);
        } else {
            this.teacherData.subjects = this.teacherData.subjects.filter(s => s !== subject);
        }
    }

    onSubmit() {
        this.isLoading = true;
        this.error = '';

        this.http.post('http://localhost:3000/register/teacher', this.teacherData).subscribe({
            next: (res: any) => {
                this.isLoading = false;
                alert('Application submitted successfully! The school admin will review your application.');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.isLoading = false;
                this.error = err.error?.message || 'Application failed';
            },
        });
    }
}
