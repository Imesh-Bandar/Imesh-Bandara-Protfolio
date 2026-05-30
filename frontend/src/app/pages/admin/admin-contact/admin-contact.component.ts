import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({ selector: 'app-admin-contact', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './admin-contact.component.html' })
export class AdminContactComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  form = { email: '', whatsapp: '', linkedin: '', facebook: '', github: '' };
  msg = ''; error = ''; saving = false;

  ngOnInit() {
    this.api.getContact().subscribe(d => { if (d) Object.assign(this.form, d); });
  }

  save() {
    this.saving = true; this.msg = ''; this.error = '';
    this.toast.info('Saving contact...');
    this.api.saveContact(this.form).subscribe({
      next: () => { this.saving = false; this.msg = 'Saved!'; this.toast.success('Contact saved!'); },
      error: () => { this.saving = false; this.error = 'Save failed.'; this.toast.error('Save failed.'); }
    });
  }
}
