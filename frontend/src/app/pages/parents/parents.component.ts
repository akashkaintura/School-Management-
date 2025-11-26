import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
    selector: 'app-parents',
    standalone: true,
    imports: [CommonModule, SidebarComponent],
    template: `
    <app-sidebar>
      <div class="bg-gradient-to-r from-pink-600 to-rose-700 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 class="text-4xl font-bold text-white mb-2">Parents</h1>
          <p class="text-pink-100">Manage parent accounts and relationships</p>
        </div>
      </div>

      <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-xl shadow-lg p-8 text-center">
          <svg class="mx-auto h-24 w-24 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="mt-4 text-xl font-semibold text-gray-900">Parents Module</h3>
          <p class="mt-2 text-gray-600">View and manage parent accounts and their children</p>
          <button class="mt-6 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-semibold">
            Add Parent
          </button>
        </div>
      </main>
    </app-sidebar>
  `,
    styles: []
})
export class ParentsComponent implements OnInit {
    ngOnInit(): void { }
}
