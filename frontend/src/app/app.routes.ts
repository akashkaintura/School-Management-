import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register-school',
        loadComponent: () => import('./pages/register-school/register-school.component').then(m => m.RegisterSchoolComponent)
    },
    {
        path: 'register-teacher',
        loadComponent: () => import('./pages/register-teacher/register-teacher.component').then(m => m.RegisterTeacherComponent)
    },
    {
        path: 'super-admin-dashboard',
        loadComponent: () => import('./pages/super-admin-dashboard/super-admin-dashboard.component').then(m => m.SuperAdminDashboardComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['SUPER_ADMIN'] }
    },
    {
        path: 'student-dashboard',
        loadComponent: () => import('./pages/dashboards/student-dashboard.component').then(m => m.StudentDashboardComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['STUDENT'] }
    },
    {
        path: 'teacher-dashboard',
        loadComponent: () => import('./pages/dashboards/teacher-dashboard.component').then(m => m.TeacherDashboardComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['TEACHER'] }
    },
    {
        path: 'principal-dashboard',
        loadComponent: () => import('./pages/dashboards/principal-dashboard.component').then(m => m.PrincipalDashboardComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['PRINCIPAL'] }
    },
    {
        path: 'finance-dashboard',
        loadComponent: () => import('./pages/dashboards/finance-dashboard.component').then(m => m.FinanceDashboardComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['FINANCE'] }
    },
    {
        path: 'parent-dashboard',
        loadComponent: () => import('./pages/dashboards/parent-dashboard.component').then(m => m.ParentDashboardComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['PARENT'] }
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'users',
        loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['PRINCIPAL', 'FINANCE'] }
    },
    {
        path: 'students',
        loadComponent: () => import('./pages/students/students.component').then(m => m.StudentsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'teachers',
        loadComponent: () => import('./pages/teachers/teachers.component').then(m => m.TeachersComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['PRINCIPAL'] }
    },
    {
        path: 'classes',
        loadComponent: () => import('./pages/classes/classes.component').then(m => m.ClassesComponent),
        canActivate: [authGuard]
    },
    {
        path: 'attendance',
        loadComponent: () => import('./pages/attendance/attendance.component').then(m => m.AttendanceComponent),
        canActivate: [authGuard]
    },
    {
        path: 'finance',
        loadComponent: () => import('./pages/finance/finance.component').then(m => m.FinanceComponent),
        canActivate: [authGuard]
    },
    {
        path: 'results',
        loadComponent: () => import('./pages/results/results.component').then(m => m.ResultsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'meetings',
        loadComponent: () => import('./pages/meetings/meetings.component').then(m => m.MeetingsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'notifications',
        loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'parents',
        loadComponent: () => import('./pages/parents/parents.component').then(m => m.ParentsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'school-settings',
        loadComponent: () => import('./pages/school-settings/school-settings.component').then(m => m.SchoolSettingsComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['PRINCIPAL'] }
    },
    {
        path: 'invitations',
        loadComponent: () => import('./pages/invitations/invitations.component').then(m => m.InvitationsComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['PRINCIPAL', 'ADMIN'] }
    },
    {
        path: 'subject-management',
        loadComponent: () => import('./pages/subject-management/subject-management.component').then(m => m.SubjectManagementComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['PRINCIPAL'] }
    }
];
