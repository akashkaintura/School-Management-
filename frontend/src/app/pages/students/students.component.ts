import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService, Student } from '../../services/student.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <app-sidebar>
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold text-white">Students</h1>
        </div>
      </div>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let student of students" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ student.student?.rollNumber }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ student.profile?.firstName }} {{ student.profile?.lastName }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ student.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {{ student.student?.class?.name }}-{{ student.student?.class?.section }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ student.profile?.phone || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button (click)="viewDetails(student)" class="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                    <button class="text-green-600 hover:text-green-900">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="students.length === 0" class="text-center py-12">
              <p class="text-gray-500">No students found</p>
            </div>
          </div>
        </div>
      </main>

      <!-- Detail Modal -->
      <div *ngIf="selectedStudent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" (click)="closeDetails()">
        <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-t-2xl">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-3xl font-bold text-white mb-2">
                  {{ selectedStudent.profile?.firstName }} {{ selectedStudent.profile?.lastName }}
                </h2>
                <p class="text-blue-100">Roll Number: {{ selectedStudent.student?.rollNumber }}</p>
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
                <p class="font-semibold text-gray-900">{{ selectedStudent.email }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Phone</p>
                <p class="font-semibold text-gray-900">{{ selectedStudent.profile?.phone || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Class</p>
                <p class="font-semibold text-gray-900">
                  {{ selectedStudent.student?.class?.name }}-{{ selectedStudent.student?.class?.section }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Admission Number</p>
                <p class="font-semibold text-gray-900">{{ selectedStudent.student?.admissionNumber }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Blood Group</p>
                <p class="font-semibold text-gray-900">{{ selectedStudent.student?.bloodGroup || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Admission Date</p>
                <p class="font-semibold text-gray-900">{{ selectedStudent.student?.admissionDate | date }}</p>
              </div>
            </div>

            <div class="flex space-x-3 mt-6">
              <button class="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold">
                Edit Student
              </button>
              <button class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold">
                View Attendance
              </button>
              <button class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold">
                View Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </app-sidebar>
  `,
  styles: []
})
export class StudentsComponent implements OnInit {
  students: any[] = [];
  selectedStudent: any = null;

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getAll().subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (error) => {
        console.error('Failed to load students:', error);
      }
    });
  }

  viewDetails(student: any): void {
    this.selectedStudent = student;
  }

  closeDetails(): void {
    this.selectedStudent = null;
  }
}
