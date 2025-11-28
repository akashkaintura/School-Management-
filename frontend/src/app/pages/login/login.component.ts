import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

declare const google: any;

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [HttpClientModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);
    private toastService = inject(ToastService);
    private invitationToken: string | null = null;

    ngOnInit() {
        // Get invitation token from URL if present
        this.route.queryParams.subscribe(params => {
            this.invitationToken = params['token'] || null;
            if (this.invitationToken) {
                console.log('Invitation token detected:', this.invitationToken);
            }
        });

        this.initializeGoogleSignIn();
    }

    initializeGoogleSignIn() {
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: environment.googleClientId,
                callback: this.handleCredentialResponse.bind(this)
            });

            google.accounts.id.renderButton(
                document.getElementById('google-signin-button'),
                {
                    theme: 'filled_blue',
                    size: 'large',
                    width: 350,
                    text: 'continue_with'
                }
            );
        }
    }

    handleCredentialResponse(response: any) {
        console.log('Received Google token');

        // Send token to backend with invitation token if present
        this.authService.googleLogin(response.credential, this.invitationToken).subscribe({
            next: (authResponse) => {
                console.log('Login successful:', authResponse);
                this.authService.saveToken(authResponse.accessToken);
                this.authService.saveUser(authResponse.user);

                // Redirect based on role
                const role = authResponse.user.role;
                switch (role) {
                    case 'SUPER_ADMIN':
                        this.router.navigate(['/super-admin-dashboard']);
                        break;
                    case 'STUDENT':
                        this.router.navigate(['/student-dashboard']);
                        break;
                    case 'TEACHER':
                        this.router.navigate(['/teacher-dashboard']);
                        break;
                    case 'PRINCIPAL':
                        this.router.navigate(['/principal-dashboard']);
                        break;
                    case 'FINANCE':
                        this.router.navigate(['/finance-dashboard']);
                        break;
                    case 'PARENT':
                        this.router.navigate(['/parent-dashboard']);
                        break;
                    default:
                        this.router.navigate(['/dashboard']);
                }
            },
            error: (error) => {
                console.error('Login failed:', error);
                this.toastService.error(error.error?.message || 'Login failed. Please try again.');
            }
        });
    }
}
