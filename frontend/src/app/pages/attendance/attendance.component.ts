import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AttendanceService } from '../../services/attendance.service';
import { ClassService } from '../../services/class.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { environment } from '../../../environments/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './attendance.component.html',
  styles: [`
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.3s ease-out forwards;
      }
    `]
})
export class AttendanceComponent implements OnInit {
  classes: any[] = [];
  attendanceRecords: any[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0];
  selectedClassId: string = '';

  // Upload Modal State
  showUploadModal = false;
  selectedFile: File | null = null;
  isDragging = false;
  previewData: any[] = [];
  uploading = false;
  uploadProgress = 0;
  uploadMessage = '';
  uploadSuccess = false;
  uploadErrors: any[] = [];

  constructor(
    private attendanceService: AttendanceService,
    private classService: ClassService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.classService.getAll().subscribe({
      next: (classes) => {
        this.classes = classes;
      },
      error: (error) => console.error('Failed to load classes:', error)
    });
  }

  loadAttendance(): void {
    if (!this.selectedClassId) return;

    this.attendanceService.getAttendanceByClass(this.selectedClassId, this.selectedDate).subscribe({
      next: (records) => {
        this.attendanceRecords = records;
      },
      error: (error) => console.error('Failed to load attendance:', error)
    });
  }

  // File Upload Methods
  toggleUploadModal() {
    this.showUploadModal = !this.showUploadModal;
    if (!this.showUploadModal) {
      this.resetUploadState();
    }
  }

  resetUploadState() {
    this.selectedFile = null;
    this.previewData = [];
    this.uploading = false;
    this.uploadProgress = 0;
    this.uploadMessage = '';
    this.uploadSuccess = false;
    this.uploadErrors = [];
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  handleFile(file: File) {
    // Validate file type
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
      this.uploadMessage = 'Invalid file type. Please upload Excel or CSV.';
      this.uploadSuccess = false;
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.uploadMessage = 'File too large. Max size is 5MB.';
      this.uploadSuccess = false;
      return;
    }

    this.selectedFile = file;
    this.uploadMessage = '';
    this.previewFile(file);
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.previewData = [];
  }

  previewFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      this.previewData = XLSX.utils.sheet_to_json(worksheet);
    };
    reader.readAsArrayBuffer(file);
  }

  downloadTemplate() {
    const templateData = [
      { 'Roll Number': '2024001', 'Student Name': 'John Doe', 'Status': 'PRESENT', 'Remarks': '' },
      { 'Roll Number': '2024002', 'Student Name': 'Jane Smith', 'Status': 'ABSENT', 'Remarks': 'Sick Leave' },
      { 'Roll Number': '2024003', 'Student Name': 'Bob Johnson', 'Status': 'LATE', 'Remarks': 'Traffic' }
    ];

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(templateData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, 'attendance_template.xlsx');
  }

  uploadFile() {
    if (!this.selectedFile || !this.selectedClassId) {
      this.uploadMessage = 'Please select a file and a class.';
      this.uploadSuccess = false;
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;

    // Simulate progress
    const interval = setInterval(() => {
      if (this.uploadProgress < 90) {
        this.uploadProgress += 10;
      }
    }, 200);

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('classId', this.selectedClassId);
    formData.append('date', this.selectedDate);
    // Assuming current user is marking, ideally get from auth service
    // For now hardcoding or getting from token would be better, but let's send a placeholder
    // The backend expects 'markedBy', we can get it from localStorage or auth service
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    formData.append('markedBy', user.id || '');

    this.http.post<any>(`${environment.apiUrl}/attendance/upload`, formData).subscribe({
      next: (response) => {
        clearInterval(interval);
        this.uploadProgress = 100;
        this.uploading = false;

        if (response.failed === 0) {
          this.uploadMessage = `Successfully uploaded ${response.successful} records!`;
          this.uploadSuccess = true;
          this.uploadErrors = [];
          setTimeout(() => {
            this.toggleUploadModal();
            this.loadAttendance();
          }, 2000);
        } else {
          this.uploadMessage = `Uploaded ${response.successful} records. ${response.failed} failed.`;
          this.uploadSuccess = false;
          this.uploadErrors = response.errors;
        }
      },
      error: (error) => {
        clearInterval(interval);
        this.uploading = false;
        this.uploadMessage = error.error?.message || 'Upload failed. Please try again.';
        this.uploadSuccess = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PRESENT': return 'bg-green-100 text-green-800';
      case 'ABSENT': return 'bg-red-100 text-red-800';
      case 'LATE': return 'bg-yellow-100 text-yellow-800';
      case 'EXCUSED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
