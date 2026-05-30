import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Project } from '../../../core/models';

@Component({ selector: 'app-admin-projects', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './admin-projects.component.html' })
export class AdminProjectsComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  projects: Project[] = [];
  form: Partial<Project> & { techStackRaw: string } = { title: '', description: '', techStackRaw: '', githubUrl: '', liveUrl: '', ownerName: '', ownerEmail: '' };
  editing?: string;
  imageFile?: File;
  imagePreview?: string;
  msg = ''; error = ''; saving = false;

  ngOnInit() { this.load(); }
  load() { this.api.getProjects().subscribe(d => this.projects = d); }

  edit(p: Project) {
    this.editing = p._id;
    this.form = { ...p, techStackRaw: p.techStack?.join(', ') || '' };
    this.imagePreview = p.image ? 'http://localhost:5000' + p.image : undefined;
  }

  reset() { this.editing = undefined; this.form = { title: '', description: '', techStackRaw: '', githubUrl: '', liveUrl: '', ownerName: '', ownerEmail: '' }; this.imageFile = undefined; this.imagePreview = undefined; }

  onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    this.imageFile = f;
    const r = new FileReader(); r.onload = ev => this.imagePreview = ev.target?.result as string; r.readAsDataURL(f);
  }

  save() {
    this.saving = true; this.msg = ''; this.error = '';
    this.toast.info('Saving project...');
    const fd = new FormData();
    const { techStackRaw, ...rest } = this.form;
    Object.entries(rest).forEach(([k, v]) => v != null && fd.append(k, String(v)));
    fd.append('techStack', JSON.stringify(techStackRaw.split(',').map(s => s.trim()).filter(Boolean)));
    if (this.imageFile) fd.append('image', this.imageFile);
    const req = this.editing ? this.api.updateProject(this.editing, fd) : this.api.createProject(fd);
    req.subscribe({
      next: () => { this.saving = false; this.msg = 'Saved!'; this.toast.success('Project saved!'); this.reset(); this.load(); },
      error: () => { this.saving = false; this.error = 'Save failed.'; this.toast.error('Save failed.'); }
    });
  }

  delete(id: string) {
    if (!confirm('Delete this project?')) return;
    this.api.deleteProject(id).subscribe({
      next: () => { this.toast.success('Project deleted'); this.load(); },
      error: () => this.toast.error('Delete failed')
    });
  }
}
