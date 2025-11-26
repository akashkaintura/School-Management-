import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
    selector: 'app-teacher-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, SidebarComponent],
    template: `
    <app-sidebar>
      <div class="bg-gradient-to-r from-green-600 to-emerald-700 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-4xl font-bold text-white mb-2">Teacher Dashboard</h1>
              <p class="text-green-100">Welcome, {{ currentUser?.profile?.firstName }} {{ currentUser?.profile?.lastName }}!</p>
            </div>
            <button 
              (click)="logout()"
              class="px-6 py-3 bg-white text-green-700 rounded-lg hover:bg-gray-100 transition font-semibold shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm font-medium">My Classes</p>
                <p class="text-3xl font-bold mt-2">3</p>
              </div>
              <svg class="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">Total Students</p>
                <p class="text-3xl font-bold mt-2">45</p>
              </div>
              <svg class="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>

          <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm font-medium">Pending Tasks</p>
                <p class="text-3xl font-bold mt-2">5</p>
              </div>
              <svg class="w-12 h-12 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <button routerLink="/attendance" class="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-semibold">
                Mark Attendance
              </button>
              <button routerLink="/results" class="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold">
                Enter Results
              </button>
              <button routerLink="/students" class="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold">
                View Students
              </button>
              <button routerLink="/meetings" class="w-full px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 transition font-semibold">
                Schedule Meeting
              </button>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Today's Schedule</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-600">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    9:00
                  </div>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">Mathematics - Class 10A</p>
                  <p class="text-sm text-gray-600">Room 201</p>
                </div>
              </div>
              <div class="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    11:00
                  </div>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">Mathematics - Class 12A</p>
                  <p class="text-sm text-gray-600">Room 301</p>
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
export class TeacherDashboardComponent implements OnInit {
    currentUser: any;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.currentUser = this.authService.getUser();
        if (!this.currentUser || this.currentUser.role !== 'TEACHER') {
            this.router.navigate(['/login']);
        }
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
