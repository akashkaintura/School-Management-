import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
    selector: 'app-meetings',
    standalone: true,
    imports: [CommonModule, SidebarComponent],
    template: `
    <app-sidebar>
      <div class="bg-gradient-to-r from-indigo-600 to-blue-700 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 class="text-4xl font-bold text-white mb-2">Meetings</h1>
          <p class="text-indigo-100">Schedule and manage parent-teacher meetings</p>
        </div>
      </div>

      <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-xl shadow-lg p-8 text-center">
          <svg class="mx-auto h-24 w-24 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-4 text-xl font-semibold text-gray-900">Meetings Module</h3>
          <p class="mt-2 text-gray-600">Schedule parent-teacher meetings and track attendance</p>
          <button class="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold">
            Schedule Meeting
          </button>
        </div>
      </main>
    </app-sidebar>
  `,
    styles: []
})
export class MeetingsComponent implements OnInit {
    ngOnInit(): void { }
}
