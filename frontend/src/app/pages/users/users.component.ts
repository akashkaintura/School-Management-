import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../services/user.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <app-sidebar>
      <div class="bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold text-white">All Users</h1>
        </div>
      </div>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let user of users" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.profile?.firstName }} {{ user.profile?.lastName }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                          [ngClass]="{
                            'bg-green-100 text-green-800': user.role === 'STUDENT',
                            'bg-blue-100 text-blue-800': user.role === 'TEACHER',
                            'bg-purple-100 text-purple-800': user.role === 'PRINCIPAL',
                            'bg-yellow-100 text-yellow-800': user.role === 'FINANCE',
                            'bg-gray-100 text-gray-800': user.role === 'PARENT'
                          }">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.profile?.phone || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button (click)="viewDetails(user)" class="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                    <button class="text-green-600 hover:text-green-900">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="users.length === 0" class="text-center py-12">
              <p class="text-gray-500">No users found</p>
            </div>
          </div>
        </div>
      </main>

      <!-- Detail Modal -->
      <div *ngIf="selectedUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" (click)="closeDetails()">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <div class="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 rounded-t-2xl">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-3xl font-bold text-white mb-2">
                  {{ selectedUser.profile?.firstName }} {{ selectedUser.profile?.lastName }}
                </h2>
                <p class="text-purple-100">{{ selectedUser.role }}</p>
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
                <p class="font-semibold text-gray-900">{{ selectedUser.email }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Phone</p>
                <p class="font-semibold text-gray-900">{{ selectedUser.profile?.phone || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Role</p>
                <p class="font-semibold text-gray-900">{{ selectedUser.role }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Status</p>
                <p class="font-semibold text-gray-900">
                  <span class="px-2 py-1 rounded-full text-xs" [ngClass]="selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ selectedUser.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Email Verified</p>
                <p class="font-semibold text-gray-900">{{ selectedUser.emailVerified ? 'Yes' : 'No' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Created At</p>
                <p class="font-semibold text-gray-900">{{ selectedUser.createdAt | date }}</p>
              </div>
            </div>

            <div class="flex space-x-3 mt-6">
              <button class="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold">
                Edit User
              </button>
              <button class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold">
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </app-sidebar>
  `,
  styles: []
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (users: any) => {
        this.users = users;
      },
      error: (error: any) => {
        console.error('Failed to load users:', error);
      }
    });
  }

  viewDetails(user: any): void {
    this.selectedUser = user;
  }

  closeDetails(): void {
    this.selectedUser = null;
  }
}
