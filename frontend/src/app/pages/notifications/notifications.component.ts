import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [CommonModule, SidebarComponent],
    template: `
    <app-sidebar>
      <div class="bg-gradient-to-r from-red-600 to-pink-700 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 class="text-4xl font-bold text-white mb-2">Notifications</h1>
          <p class="text-red-100">Send and manage school notifications</p>
        </div>
      </div>

      <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-xl shadow-lg p-8 text-center">
          <svg class="mx-auto h-24 w-24 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h3 class="mt-4 text-xl font-semibold text-gray-900">Notifications Module</h3>
          <p class="mt-2 text-gray-600">Send announcements and notifications to students and parents</p>
          <button class="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
            Send Notification
          </button>
        </div>
      </main>
    </app-sidebar>
  `,
    styles: []
})
export class NotificationsComponent implements OnInit {
    ngOnInit(): void { }
}
