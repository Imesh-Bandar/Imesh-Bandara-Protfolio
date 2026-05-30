import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Feedback } from '../../../core/models';

@Component({ selector: 'app-admin-feedback', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './admin-feedback.component.html' })
export class AdminFeedbackComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  feedbacks: Feedback[] = [];
  form: Partial<Feedback> = { clientName: '', clientRole: '', company: '', message: '', rating: 5, approved: true };
  editing?: string;
  avatarFile?: File;
  avatarPreview?: string;
  msg = ''; error = ''; saving = false;

  ngOnInit() { this.load(); }
  load() { this.api.getAllFeedback().subscribe(d => this.feedbacks = d); }

  edit(f: Feedback) {
    this.editing = f._id; this.form = { ...f };
    this.avatarPreview = f.avatar ? 'http://localhost:5000' + f.avatar : undefined;
  }
  reset() { this.editing = undefined; this.form = { clientName: '', clientRole: '', company: '', message: '', rating: 5, approved: true }; this.avatarFile = undefined; this.avatarPreview = undefined; }

  onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
    this.avatarFile = f;
    const r = new FileReader(); r.onload = ev => this.avatarPreview = ev.target?.result as string; r.readAsDataURL(f);
  }

  save() {
    this.saving = true; this.msg = ''; this.error = '';
    const fd = new FormData();
    Object.entries(this.form).forEach(([k, v]) => v != null && fd.append(k, String(v)));
    if (this.avatarFile) fd.append('avatar', this.avatarFile);
    this.toast.info('Saving feedback...');
    const req = this.editing ? this.api.updateFeedback(this.editing, fd) : this.api.createFeedback(fd);
    req.subscribe({
      next: () => { this.saving = false; this.msg = 'Saved!'; this.toast.success('Feedback saved!'); this.reset(); this.load(); },
      error: () => { this.saving = false; this.error = 'Save failed.'; this.toast.error('Save failed.'); }
    });
  }

  delete(id: string) {
    if (!confirm('Delete?')) return;
    this.api.deleteFeedback(id).subscribe({
      next: () => { this.toast.success('Feedback deleted'); this.load(); },
      error: () => this.toast.error('Delete failed')
    });
  }

  stars(n: number) { return '★'.repeat(n) + '☆'.repeat(5 - n); }
}
