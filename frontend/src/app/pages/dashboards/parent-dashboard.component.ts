import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
    selector: 'app-parent-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, SidebarComponent],
    template: `
    <app-sidebar>
      <div class="bg-gradient-to-r from-pink-600 to-rose-700 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-4xl font-bold text-white mb-2">Parent Dashboard</h1>
              <p class="text-pink-100">Track Your Child's Progress</p>
            </div>
            <button 
              (click)="logout()"
              class="px-6 py-3 bg-white text-pink-700 rounded-lg hover:bg-gray-100 transition font-semibold shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">Attendance</p>
                <p class="text-3xl font-bold mt-2">95%</p>
              </div>
              <svg class="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm font-medium">Performance</p>
                <p class="text-3xl font-bold mt-2">A Grade</p>
              </div>
              <svg class="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>

          <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-yellow-100 text-sm font-medium">Fee Status</p>
                <p class="text-3xl font-bold mt-2">Paid</p>
              </div>
              <svg class="w-12 h-12 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button routerLink="/results" class="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold">
              View Results
            </button>
            <button routerLink="/attendance" class="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-semibold">
              View Attendance
            </button>
            <button routerLink="/meetings" class="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold">
              Schedule Meeting
            </button>
          </div>
        </div>
      </main>
    </app-sidebar>
  `,
    styles: []
})
export class ParentDashboardComponent implements OnInit {
    currentUser: any;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.currentUser = this.authService.getUser();
        if (!this.currentUser || this.currentUser.role !== 'PARENT') {
            this.router.navigate(['/login']);
        }
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
