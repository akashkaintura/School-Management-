import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
    selector: 'app-finance-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, SidebarComponent],
    template: `
    <app-sidebar>
      <div class="bg-gradient-to-r from-yellow-600 to-orange-700 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-4xl font-bold text-white mb-2">Finance Dashboard</h1>
              <p class="text-yellow-100">Financial Management</p>
            </div>
            <button 
              (click)="logout()"
              class="px-6 py-3 bg-white text-yellow-700 rounded-lg hover:bg-gray-100 transition font-semibold shadow-md"
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
                <p class="text-green-100 text-sm font-medium">Total Collected</p>
                <p class="text-3xl font-bold mt-2">₹ 5,00,000</p>
              </div>
              <svg class="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-100 text-sm font-medium">Pending</p>
                <p class="text-3xl font-bold mt-2">₹ 50,000</p>
              </div>
              <svg class="w-12 h-12 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">This Month</p>
                <p class="text-3xl font-bold mt-2">₹ 1,20,000</p>
              </div>
              <svg class="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button routerLink="/finance" class="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-semibold">
              View Payments
            </button>
            <button routerLink="/students" class="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold">
              Student Fees
            </button>
            <button class="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold">
              Generate Report
            </button>
          </div>
        </div>
      </main>
    </app-sidebar>
  `,
    styles: []
})
export class FinanceDashboardComponent implements OnInit {
    currentUser: any;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.currentUser = this.authService.getUser();
        if (!this.currentUser || this.currentUser.role !== 'FINANCE') {
            this.router.navigate(['/login']);
        }
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
