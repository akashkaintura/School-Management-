import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherService, Teacher } from '../../services/teacher.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <app-sidebar>
      <div class="bg-gradient-to-r from-green-600 to-emerald-700 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold text-white">Teachers</h1>
        </div>
      </div>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let teacher of teachers" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ teacher.teacher?.employeeId }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ teacher.profile?.firstName }} {{ teacher.profile?.lastName }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ teacher.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {{ teacher.teacher?.specialization }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ teacher.teacher?.experience }} years
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button (click)="viewDetails(teacher)" class="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                    <button class="text-green-600 hover:text-green-900">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="teachers.length === 0" class="text-center py-12">
              <p class="text-gray-500">No teachers found</p>
            </div>
          </div>
        </div>
      </main>

      <!-- Detail Modal -->
      <div *ngIf="selectedTeacher" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" (click)="closeDetails()">
        <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <div class="bg-gradient-to-r from-green-600 to-emerald-700 p-8 rounded-t-2xl">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-3xl font-bold text-white mb-2">
                  {{ selectedTeacher.profile?.firstName }} {{ selectedTeacher.profile?.lastName }}
                </h2>
                <p class="text-green-100">Employee ID: {{ selectedTeacher.teacher?.employeeId }}</p>
              </div>
              <button (click)="closeDetails()" class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-8">
            <div class="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p class="text-sm text-gray-500 mb-1">Email</p>
                <p class="font-semibold text-gray-900">{{ selectedTeacher.email }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Phone</p>
                <p class="font-semibold text-gray-900">{{ selectedTeacher.profile?.phone || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Specialization</p>
                <p class="font-semibold text-gray-900">{{ selectedTeacher.teacher?.specialization }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Qualification</p>
                <p class="font-semibold text-gray-900">{{ selectedTeacher.teacher?.qualification }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Experience</p>
                <p class="font-semibold text-gray-900">{{ selectedTeacher.teacher?.experience }} years</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Joining Date</p>
                <p class="font-semibold text-gray-900">{{ selectedTeacher.teacher?.joiningDate | date }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Salary</p>
                <p class="font-semibold text-gray-900">₹ {{ selectedTeacher.teacher?.salary | number }}</p>
              </div>
            </div>

            <div class="flex space-x-3 mt-6">
              <button class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold">
                Edit Teacher
              </button>
              <button class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold">
                View Classes
              </button>
              <button class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold">
                Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </app-sidebar>
  `,
  styles: []
})
export class TeachersComponent implements OnInit {
  teachers: any[] = [];
  selectedTeacher: any = null;

  constructor(private teacherService: TeacherService) { }

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.teacherService.getAll().subscribe({
      next: (teachers) => {
        this.teachers = teachers;
      },
      error: (error) => {
        console.error('Failed to load teachers:', error);
      }
    });
  }

  viewDetails(teacher: any): void {
    this.selectedTeacher = teacher;
  }

  closeDetails(): void {
    this.selectedTeacher = null;
  }
}
