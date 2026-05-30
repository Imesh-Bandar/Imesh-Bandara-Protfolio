import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

@Component({ selector: 'app-admin-resume', standalone: true, imports: [CommonModule], templateUrl: './admin-resume.component.html' })
export class AdminResumeComponent {
  private api = inject(ApiService);
  resumeFile?: File;
  msg = ''; error = ''; saving = false;
  downloadUrl = this.api.downloadResume();

  onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) this.resumeFile = f;
  }

  upload() {
    if (!this.resumeFile) return;
    this.saving = true; this.msg = ''; this.error = '';
    const fd = new FormData();
    fd.append('resume', this.resumeFile);
    this.api.uploadResume(fd).subscribe({
      next: () => { this.msg = 'Resume uploaded successfully!'; this.saving = false; this.resumeFile = undefined; },
      error: () => { this.error = 'Upload failed.'; this.saving = false; }
    });
  }
}
