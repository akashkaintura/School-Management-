import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
    selector: 'app-principal-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, SidebarComponent],
    template: `
    <app-sidebar>
      <div class="bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-4xl font-bold text-white mb-2">Principal Dashboard</h1>
              <p class="text-purple-100">School Management Overview</p>
            </div>
            <button 
              (click)="logout()"
              class="px-6 py-3 bg-white text-purple-700 rounded-lg hover:bg-gray-100 transition font-semibold shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">Total Students</p>
                <p class="text-3xl font-bold mt-2">{{ stats.students }}</p>
              </div>
              <svg class="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm font-medium">Total Teachers</p>
                <p class="text-3xl font-bold mt-2">{{ stats.teachers }}</p>
              </div>
              <svg class="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-yellow-100 text-sm font-medium">Total Classes</p>
                <p class="text-3xl font-bold mt-2">2</p>
              </div>
              <svg class="w-12 h-12 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm font-medium">Total Users</p>
                <p class="text-3xl font-bold mt-2">{{ stats.totalUsers }}</p>
              </div>
              <svg class="w-12 h-12 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Management</h3>
            <div class="grid grid-cols-2 gap-3">
              <button routerLink="/users" class="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold">
                All Users
              </button>
              <button routerLink="/students" class="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-semibold">
                Students
              </button>
              <button routerLink="/teachers" class="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold">
                Teachers
              </button>
              <button routerLink="/classes" class="px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 transition font-semibold">
                Classes
              </button>
              <button routerLink="/finance" class="px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition font-semibold">
                Finance
              </button>
              <button routerLink="/attendance" class="px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition font-semibold">
                Attendance
              </button>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div class="space-y-3">
              <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">New student enrolled</p>
                  <p class="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">Attendance marked for Class 10A</p>
                  <p class="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </app-sidebar>
  `,
    styles: []
})
export class PrincipalDashboardComponent implements OnInit {
    currentUser: any;
    stats = {
        totalUsers: 0,
        students: 0,
        teachers: 0
    };

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.currentUser = this.authService.getUser();
        if (!this.currentUser || this.currentUser.role !== 'PRINCIPAL') {
            this.router.navigate(['/login']);
            return;
        }
        this.loadStats();
    }

    loadStats(): void {
        this.userService.getAll().subscribe({
            next: (users) => {
                this.stats.totalUsers = users.length;
                this.stats.students = users.filter(u => u.role === 'STUDENT').length;
                this.stats.teachers = users.filter(u => u.role === 'TEACHER').length;
            },
            error: (error) => console.error('Failed to load stats:', error)
        });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
