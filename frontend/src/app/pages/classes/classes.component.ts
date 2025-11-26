import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClassService, Class } from '../../services/class.service';
import { StudentService } from '../../services/student.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <app-sidebar>
      <div class="bg-gradient-to-r from-yellow-600 to-orange-700 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-4xl font-bold text-white mb-2">Classes</h1>
              <p class="text-yellow-100">Manage school classes and sections</p>
            </div>
            <button (click)="openAddClassModal()" class="px-6 py-3 bg-white text-yellow-700 rounded-lg hover:bg-gray-100 transition font-semibold shadow-md">
              + Add Class
            </button>
          </div>
        </div>
      </div>

      <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">Total Classes</p>
                <p class="text-3xl font-bold mt-2">{{ classes.length }}</p>
              </div>
              <svg class="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm font-medium">Total Students</p>
                <p class="text-3xl font-bold mt-2">{{ totalStudents }}</p>
              </div>
              <svg class="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>

          <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm font-medium">Academic Year</p>
                <p class="text-2xl font-bold mt-2">2024-2025</p>
              </div>
              <svg class="w-12 h-12 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-yellow-100 text-sm font-medium">Avg. Class Size</p>
                <p class="text-3xl font-bold mt-2">{{ averageClassSize }}</p>
              </div>
              <svg class="w-12 h-12 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Classes Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let class of classes" 
               class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1">
            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-3xl font-bold text-white">Class {{ class.name }}-{{ class.section }}</h3>
                  <p class="text-indigo-100 mt-1">{{ class.academicYear }}</p>
                </div>
                <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span class="text-gray-600 font-medium">Students</span>
                  </div>
                  <span class="text-gray-900 font-bold">{{ class._count?.students || 0 }} / {{ class.capacity }}</span>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span class="text-gray-600 font-medium">Room</span>
                  </div>
                  <span class="text-gray-900 font-bold">{{ class.roomNumber }}</span>
                </div>

                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div class="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full" 
                       [style.width.%]="(class._count?.students || 0) / class.capacity * 100"></div>
                </div>

                <div class="flex space-x-2 mt-4">
                  <button (click)="viewDetails(class)" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-semibold">
                    View Details
                  </button>
                  <button (click)="openEditModal(class)" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="classes.length === 0" class="text-center py-12">
          <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p class="mt-4 text-xl text-gray-500">No classes found</p>
          <p class="text-gray-400">Add your first class to get started</p>
        </div>
      </main>

      <!-- Detail Modal -->
      <div *ngIf="selectedClass && !showStudents" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" (click)="closeDetails()">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-t-2xl">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-4xl font-bold text-white mb-2">Class {{ selectedClass.name }}-{{ selectedClass.section }}</h2>
                <p class="text-indigo-100">{{ selectedClass.academicYear }}</p>
              </div>
              <button (click)="closeDetails()" class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-8">
            <div class="grid grid-cols-2 gap-6 mb-8">
              <div class="bg-blue-50 rounded-xl p-4">
                <p class="text-blue-600 text-sm font-medium mb-1">Room Number</p>
                <p class="text-2xl font-bold text-gray-900">{{ selectedClass.roomNumber }}</p>
              </div>
              <div class="bg-green-50 rounded-xl p-4">
                <p class="text-green-600 text-sm font-medium mb-1">Capacity</p>
                <p class="text-2xl font-bold text-gray-900">{{ selectedClass.capacity }}</p>
              </div>
              <div class="bg-purple-50 rounded-xl p-4">
                <p class="text-purple-600 text-sm font-medium mb-1">Current Students</p>
                <p class="text-2xl font-bold text-gray-900">{{ selectedClass._count?.students || 0 }}</p>
              </div>
              <div class="bg-yellow-50 rounded-xl p-4">
                <p class="text-yellow-600 text-sm font-medium mb-1">Available Seats</p>
                <p class="text-2xl font-bold text-gray-900">{{ selectedClass.capacity - (selectedClass._count?.students || 0) }}</p>
              </div>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-bold text-gray-900 mb-3">Capacity Status</h3>
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div class="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full flex items-center justify-end pr-2" 
                     [style.width.%]="(selectedClass._count?.students || 0) / selectedClass.capacity * 100">
                  <span class="text-white text-xs font-bold">{{ ((selectedClass._count?.students || 0) / selectedClass.capacity * 100).toFixed(0) }}%</span>
                </div>
              </div>
            </div>

            <div class="flex space-x-3">
              <button (click)="viewStudentsInClass()" class="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold">
                View Students
              </button>
              <button (click)="openEditModal(selectedClass)" class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold">
                Edit Class
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Students in Class Modal -->
      <div *ngIf="showStudents" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" (click)="closeStudentsList()">
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-t-2xl">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-3xl font-bold text-white mb-2">Students in Class {{ selectedClass?.name }}-{{ selectedClass?.section }}</h2>
                <p class="text-blue-100">{{ classStudents.length }} students enrolled</p>
              </div>
              <button (click)="closeStudentsList()" class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-8">
            <div *ngIf="classStudents.length > 0" class="space-y-4">
              <div *ngFor="let student of classStudents" class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-semibold text-gray-900">{{ student.user?.profile?.firstName }} {{ student.user?.profile?.lastName }}</p>
                    <p class="text-sm text-gray-500">Roll Number: {{ student.rollNumber }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-600">{{ student.user?.email }}</p>
                    <p class="text-sm text-gray-500">{{ student.user?.profile?.phone || 'No phone' }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="classStudents.length === 0" class="text-center py-12">
              <p class="text-gray-500">No students enrolled in this class yet</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Class Modal -->
      <div *ngIf="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" (click)="closeEditModal()">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full" (click)="$event.stopPropagation()">
          <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl">
            <h2 class="text-2xl font-bold text-white">Edit Class</h2>
          </div>
          <form (ngSubmit)="saveClass()" class="p-6">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Class Name</label>
                <input type="text" [(ngModel)]="editingClass.name" name="name" required
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Section</label>
                <input type="text" [(ngModel)]="editingClass.section" name="section" required
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                <input type="text" [(ngModel)]="editingClass.roomNumber" name="roomNumber" required
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                <input type="number" [(ngModel)]="editingClass.capacity" name="capacity" required
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                <input type="text" [(ngModel)]="editingClass.academicYear" name="academicYear" required
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              </div>
            </div>
            <div class="flex space-x-3">
              <button type="submit" class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold">
                Save Changes
              </button>
              <button type="button" (click)="closeEditModal()" class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Add Class Modal -->
      <div *ngIf="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" (click)="closeAddModal()">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full" (click)="$event.stopPropagation()">
          <div class="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 rounded-t-2xl">
            <h2 class="text-2xl font-bold text-white">Add New Class</h2>
          </div>
          <form (ngSubmit)="addClass()" class="p-6">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Class Name</label>
                <input type="text" [(ngModel)]="newClass.name" name="name" required placeholder="e.g., 11"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Section</label>
                <input type="text" [(ngModel)]="newClass.section" name="section" required placeholder="e.g., A"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                <input type="text" [(ngModel)]="newClass.roomNumber" name="roomNumber" required placeholder="e.g., 401"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                <input type="number" [(ngModel)]="newClass.capacity" name="capacity" required placeholder="e.g., 40"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                <input type="text" [(ngModel)]="newClass.academicYear" name="academicYear" required placeholder="e.g., 2024-2025"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
              </div>
            </div>
            <div class="flex space-x-3">
              <button type="submit" class="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold">
                Add Class
              </button>
              <button type="button" (click)="closeAddModal()" class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </app-sidebar>
  `,
  styles: []
})
export class ClassesComponent implements OnInit {
  classes: Class[] = [];
  totalStudents = 0;
  averageClassSize = 0;
  selectedClass: Class | null = null;
  showStudents = false;
  classStudents: any[] = [];
  showEditModal = false;
  showAddModal = false;
  editingClass: any = {};
  newClass: any = {
    name: '',
    section: '',
    roomNumber: '',
    capacity: 0,
    academicYear: '2024-2025'
  };

  constructor(
    private classService: ClassService,
    private studentService: StudentService
  ) { }

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.classService.getAll().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.calculateStats();
      },
      error: (error) => {
        console.error('Failed to load classes:', error);
      }
    });
  }

  calculateStats(): void {
    this.totalStudents = this.classes.reduce((sum, c) => sum + (c._count?.students || 0), 0);
    this.averageClassSize = this.classes.length > 0
      ? Math.round(this.totalStudents / this.classes.length)
      : 0;
  }

  viewDetails(classItem: Class): void {
    this.selectedClass = classItem;
    this.showStudents = false;
  }

  closeDetails(): void {
    this.selectedClass = null;
    this.showStudents = false;
  }

  viewStudentsInClass(): void {
    if (!this.selectedClass) return;

    this.classService.getById(this.selectedClass.id).subscribe({
      next: (classData: any) => {
        this.classStudents = classData.students || [];
        this.showStudents = true;
      },
      error: (error) => console.error('Failed to load students:', error)
    });
  }

  closeStudentsList(): void {
    this.showStudents = false;
    this.classStudents = [];
  }

  openEditModal(classItem: Class): void {
    this.editingClass = { ...classItem };
    this.showEditModal = true;
    this.selectedClass = null;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingClass = {};
  }

  saveClass(): void {
    if (!this.editingClass.id) return;

    this.classService.update(this.editingClass.id, this.editingClass).subscribe({
      next: () => {
        alert('Class updated successfully!');
        this.closeEditModal();
        this.loadClasses();
      },
      error: (error) => {
        console.error('Failed to update class:', error);
        alert('Failed to update class');
      }
    });
  }

  openAddClassModal(): void {
    this.newClass = {
      name: '',
      section: '',
      roomNumber: '',
      capacity: 0,
      academicYear: '2024-2025'
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  addClass(): void {
    this.classService.create(this.newClass).subscribe({
      next: () => {
        alert('Class added successfully!');
        this.closeAddModal();
        this.loadClasses();
      },
      error: (error) => {
        console.error('Failed to add class:', error);
        alert('Failed to add class');
      }
    });
  }
}
