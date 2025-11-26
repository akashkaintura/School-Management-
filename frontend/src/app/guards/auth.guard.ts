import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        router.navigate(['/login']);
        return false;
    }

    const userRole = authService.getUserRole();
    const allowedRoles = route.data['roles'] as string[];

    if (allowedRoles && allowedRoles.includes(userRole!)) {
        return true;
    }

    // Redirect to appropriate dashboard based on role
    switch (userRole) {
        case 'STUDENT':
            router.navigate(['/student-dashboard']);
            break;
        case 'TEACHER':
            router.navigate(['/teacher-dashboard']);
            break;
        case 'PRINCIPAL':
            router.navigate(['/principal-dashboard']);
            break;
        case 'FINANCE':
            router.navigate(['/finance-dashboard']);
            break;
        case 'PARENT':
            router.navigate(['/parent-dashboard']);
            break;
        default:
            router.navigate(['/dashboard']);
    }

    return false;
};
