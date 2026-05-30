import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { SdlcPhase } from '../../../core/models';

@Component({ selector: 'app-admin-sdlc', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './admin-sdlc.component.html' })
export class AdminSdlcComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  phases: SdlcPhase[] = [];
  form: Partial<SdlcPhase> = { phase: '', title: '', description: '', icon: '' };
  editing?: string;
  msg = ''; error = ''; saving = false;

  icons = ['description','design_services','code','bug_report','rocket_launch','support','analytics','settings','group','lightbulb'];

  ngOnInit() { this.load(); }
  load() { this.api.getSdlc().subscribe(d => this.phases = d); }
  edit(p: SdlcPhase) { this.editing = p._id; this.form = { ...p }; }
  reset() { this.editing = undefined; this.form = { phase: '', title: '', description: '', icon: '' }; }

  save() {
    this.saving = true; this.msg = ''; this.error = '';
    this.toast.info('Saving phase...');
    const req = this.editing ? this.api.updateSdlc(this.editing, this.form) : this.api.createSdlc(this.form);
    req.subscribe({
      next: () => { this.saving = false; this.msg = 'Saved!'; this.toast.success('Phase saved!'); this.reset(); this.load(); },
      error: () => { this.saving = false; this.error = 'Save failed.'; this.toast.error('Save failed.'); }
    });
  }

  delete(id: string) {
    if (!confirm('Delete this phase?')) return;
    this.api.deleteSdlc(id).subscribe({
      next: () => { this.toast.success('Phase deleted'); this.load(); },
      error: () => this.toast.error('Delete failed')
    });
  }
}
