import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ResultsService } from '../../services/results.service';
import { ClassService } from '../../services/class.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { environment } from '../../../environments/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './results.component.html',
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
export class ResultsComponent implements OnInit {
  classes: any[] = [];
  subjects: any[] = [];
  results: any[] = [];

  selectedClassId: string = '';
  selectedSubjectId: string = '';
  selectedExamId: string = '';

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
    private resultsService: ResultsService,
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

  loadSubjects(): void {
    if (!this.selectedClassId) {
      this.subjects = [];
      return;
    }

    // Fetch subjects for the selected class
    this.http.get<any[]>(`${environment.apiUrl}/subjects/class/${this.selectedClassId}`).subscribe({
      next: (subjects) => {
        this.subjects = subjects;
      },
      error: (error) => console.error('Failed to load subjects:', error)
    });
  }

  loadResults(): void {
    if (!this.selectedClassId || !this.selectedSubjectId || !this.selectedExamId) return;

    // We need an endpoint to get results by class/subject/exam
    // Currently we have getResultsByExam, which returns all results for an exam
    // We might need to filter on client side or add a new endpoint
    // For now, let's use getResultsByExam and filter
    this.resultsService.getResultsByExam(this.selectedExamId).subscribe({
      next: (results) => {
        this.results = results.filter(r =>
          r.subjectId === this.selectedSubjectId &&
          r.student?.classId === this.selectedClassId
        );
      },
      error: (error) => console.error('Failed to load results:', error)
    });
  }

  getGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
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
      { 'Roll Number': '2024001', 'Marks Obtained': 85, 'Max Marks': 100, 'Grade': 'A', 'Remarks': 'Excellent' },
      { 'Roll Number': '2024002', 'Marks Obtained': 92, 'Max Marks': 100, 'Grade': 'A+', 'Remarks': 'Outstanding' },
      { 'Roll Number': '2024003', 'Marks Obtained': 78, 'Max Marks': 100, 'Grade': 'B+', 'Remarks': 'Good' }
    ];

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(templateData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Results');
    XLSX.writeFile(wb, 'results_template.xlsx');
  }

  uploadFile() {
    if (!this.selectedFile || !this.selectedClassId || !this.selectedSubjectId || !this.selectedExamId) {
      this.uploadMessage = 'Please select file, class, subject and exam.';
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
    formData.append('subjectId', this.selectedSubjectId);
    formData.append('examId', this.selectedExamId);

    this.resultsService.uploadResults(formData).subscribe({
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
            this.loadResults();
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
}
