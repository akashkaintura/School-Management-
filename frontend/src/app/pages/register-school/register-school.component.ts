import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-register-school',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './register-school.component.html',
})
export class RegisterSchoolComponent {
    schoolData = {
        schoolName: '',
        schoolCode: '',
        board: 'CBSE',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        email: '',
        password: '',
        principalName: '',
    };

    boards = ['CBSE', 'ICSE', 'IB', 'STATE_BOARD'];
    isLoading = false;
    error = '';

    constructor(private http: HttpClient, private router: Router) { }

    onSubmit() {
        this.isLoading = true;
        this.error = '';

        this.http.post('http://localhost:3000/register/school', this.schoolData).subscribe({
            next: (res: any) => {
                this.isLoading = false;
                alert('School registered successfully! Please login.');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.isLoading = false;
                this.error = err.error?.message || 'Registration failed';
            },
        });
    }
}
