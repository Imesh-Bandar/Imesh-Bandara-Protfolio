import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Tool } from '../../../core/models';

@Component({ selector: 'app-admin-tools', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './admin-tools.component.html' })
export class AdminToolsComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  tools: Tool[] = [];
  form: Partial<Tool> = { name: '' };
  editing?: string;
  msg = ''; error = ''; saving = false;

  ngOnInit() { this.load(); }
  load() { this.api.getTools().subscribe(d => this.tools = d); }
  edit(t: Tool) { this.editing = t._id; this.form = { ...t }; }
  reset() { this.editing = undefined; this.form = { name: '' }; }

  save() {
    this.saving = true; this.msg = ''; this.error = '';
    const req = this.editing ? this.api.updateTool(this.editing, this.form) : this.api.createTool(this.form);
    this.toast.info('Saving tool...');
    req.subscribe({
      next: () => { this.saving = false; this.msg = 'Saved!'; this.toast.success('Tool saved!'); this.reset(); this.load(); },
      error: () => { this.saving = false; this.error = 'Save failed.'; this.toast.error('Save failed.'); }
    });
  }

  delete(id: string) {
    if (!confirm('Delete this tool?')) return;
    this.api.deleteTool(id).subscribe({
      next: () => { this.toast.success('Tool deleted'); this.load(); },
      error: () => this.toast.error('Delete failed')
    });
  }
}
