import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService, FeePayment } from '../../services/finance.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <app-sidebar>
      <div class="bg-gradient-to-r from-yellow-600 to-orange-700 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 class="text-4xl font-bold text-white mb-2">Finance Management</h1>
          <p class="text-yellow-100">Track fee payments and collections</p>
        </div>
      </div>

      <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm font-medium">Total Collected</p>
                <p class="text-3xl font-bold mt-2">₹ {{ stats.totalCollected | number }}</p>
              </div>
              <svg class="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-100 text-sm font-medium">Pending</p>
                <p class="text-3xl font-bold mt-2">₹ {{ stats.totalPending | number }}</p>
              </div>
              <svg class="w-12 h-12 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">This Month</p>
                <p class="text-3xl font-bold mt-2">₹ {{ stats.monthlyCollection | number }}</p>
              </div>
              <svg class="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Payments Table -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Recent Payments</h3>
            <button (click)="showAddPaymentMessage()" class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold">
              + Add Payment
            </button>
          </div>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let payment of payments" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ payment.student?.user?.profile?.firstName }} {{ payment.student?.user?.profile?.lastName }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">₹ {{ payment.amount | number }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ payment.paymentDate | date }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ payment.paymentMethod }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full"
                        [ngClass]="{
                          'bg-green-100 text-green-800': payment.status === 'PAID',
                          'bg-yellow-100 text-yellow-800': payment.status === 'PENDING',
                          'bg-red-100 text-red-800': payment.status === 'OVERDUE'
                        }">
                    {{ payment.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button class="text-indigo-600 hover:text-indigo-900">View</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="payments.length === 0" class="text-center py-12">
            <p class="text-gray-500">No payments found</p>
          </div>
        </div>
      </main>

      <!-- Coming Soon Modal -->
      <div *ngIf="showComingSoon" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" (click)="closeComingSoon()">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all" (click)="$event.stopPropagation()">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
              <svg class="h-10 w-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Coming Soon!</h3>
            <p class="text-gray-600 mb-6">The Add Payment feature will be available soon. This will allow you to record new fee payments with student selection, amount, and payment method.</p>
            <button (click)="closeComingSoon()" class="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold">
              Got it!
            </button>
          </div>
        </div>
      </div>
    </app-sidebar>
  `,
  styles: []
})
export class FinanceComponent implements OnInit {
  payments: any[] = [];
  showComingSoon = false;
  stats = {
    totalCollected: 0,
    totalPending: 0,
    monthlyCollection: 0
  };

  constructor(private financeService: FinanceService) { }

  ngOnInit(): void {
    this.loadStats();
    this.loadPayments();
  }

  loadStats(): void {
    this.financeService.getFinanceStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => console.error('Failed to load stats:', error)
    });
  }

  loadPayments(): void {
    this.financeService.getAllPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
      },
      error: (error) => console.error('Failed to load payments:', error)
    });
  }

  showAddPaymentMessage(): void {
    this.showComingSoon = true;
  }

  closeComingSoon(): void {
    this.showComingSoon = false;
  }
}
