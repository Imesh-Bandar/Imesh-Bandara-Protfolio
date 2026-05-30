import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Education } from '../../../core/models';

@Component({ selector: 'app-admin-education', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './admin-education.component.html' })
export class AdminEducationComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  education: Education[] = [];
  form: Partial<Education> = { type: 'degree', title: '', institution: '', grade: '', startDate: '', endDate: '', status: 'completed' };
  editing?: string;
  msg = ''; error = ''; saving = false;

  ngOnInit() { this.load(); }
  load() { this.api.getEducation().subscribe(d => this.education = d); }
  edit(e: Education) { this.editing = e._id; this.form = { ...e }; }
  reset() { this.editing = undefined; this.form = { type: 'degree', title: '', institution: '', grade: '', startDate: '', endDate: '', status: 'completed' }; }

  save() {
    this.saving = true; this.msg = ''; this.error = '';
    this.toast.info('Saving education...');
    const req = this.editing ? this.api.updateEducation(this.editing, this.form) : this.api.createEducation(this.form);
    req.subscribe({
      next: () => { this.saving = false; this.msg = 'Saved!'; this.toast.success('Education saved!'); this.reset(); this.load(); },
      error: () => { this.saving = false; this.error = 'Save failed.'; this.toast.error('Save failed.'); }
    });
  }

  delete(id: string) {
    if (!confirm('Delete?')) return;
    this.api.deleteEducation(id).subscribe({
      next: () => { this.toast.success('Education deleted'); this.load(); },
      error: () => this.toast.error('Delete failed')
    });
  }

  typeLabel(t: string) { return t === 'degree' ? 'Degree' : t === 'diploma' ? 'Diploma' : 'Certification'; }
}
