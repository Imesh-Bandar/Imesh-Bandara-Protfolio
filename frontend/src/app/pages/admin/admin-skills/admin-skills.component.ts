import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Skill } from '../../../core/models';

@Component({ selector: 'app-admin-skills', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './admin-skills.component.html' })
export class AdminSkillsComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  skills: Skill[] = [];
  form: Partial<Skill> = { category: '', name: '', proficiency: 80 };
  editing?: string;
  msg = ''; error = ''; saving = false;
  categories = ['Languages', 'Backend', 'Frontend', 'Database', 'Other'];

  ngOnInit() { this.load(); }
  load() { this.api.getSkills().subscribe(d => this.skills = d); }
  edit(s: Skill) { this.editing = s._id; this.form = { ...s }; }
  reset() { this.editing = undefined; this.form = { category: '', name: '', proficiency: 80 }; }

  save() {
    this.saving = true; this.msg = ''; this.error = '';
    this.toast.info('Saving skill...');
    const req = this.editing ? this.api.updateSkill(this.editing, this.form) : this.api.createSkill(this.form);
    req.subscribe({
      next: () => { this.saving = false; this.msg = 'Saved!'; this.toast.success('Skill saved!'); this.reset(); this.load(); },
      error: () => { this.saving = false; this.error = 'Save failed.'; this.toast.error('Save failed.'); }
    });
  }

  delete(id: string) {
    if (!confirm('Delete this skill?')) return;
    this.api.deleteSkill(id).subscribe({
      next: () => { this.toast.success('Skill deleted'); this.load(); },
      error: () => this.toast.error('Delete failed')
    });
  }

  groupedCategories(): string[] { return [...new Set(this.skills.map(s => s.category))]; }
  byCategory(cat: string) { return this.skills.filter(s => s.category === cat); }
}
