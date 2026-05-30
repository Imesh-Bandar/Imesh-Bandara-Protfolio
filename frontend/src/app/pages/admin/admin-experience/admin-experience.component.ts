import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Experience } from '../../../core/models';

@Component({ selector: 'app-admin-experience', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './admin-experience.component.html' })
export class AdminExperienceComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  experience: Experience[] = [];
  form: Partial<Experience> = { company: '', role: '', startDate: '', endDate: '', current: false, description: '' };
  editing?: string;
  msg = ''; error = ''; saving = false;

  ngOnInit() { this.load(); }
  load() { this.api.getExperience().subscribe(d => this.experience = d); }
  edit(e: Experience) { this.editing = e._id; this.form = { ...e }; }
  reset() { this.editing = undefined; this.form = { company: '', role: '', startDate: '', endDate: '', current: false, description: '' }; }

  save() {
    this.saving = true; this.msg = ''; this.error = '';
    this.toast.info('Saving experience...');
    const req = this.editing ? this.api.updateExperience(this.editing, this.form) : this.api.createExperience(this.form);
    req.subscribe({
      next: () => { this.saving = false; this.msg = 'Saved!'; this.toast.success('Experience saved!'); this.reset(); this.load(); },
      error: () => { this.saving = false; this.error = 'Save failed.'; this.toast.error('Save failed.'); }
    });
  }

  delete(id: string) {
    if (!confirm('Delete?')) return;
    this.api.deleteExperience(id).subscribe({
      next: () => { this.toast.success('Experience deleted'); this.load(); },
      error: () => this.toast.error('Delete failed')
    });
  }
}
