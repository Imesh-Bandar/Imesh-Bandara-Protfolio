import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-about',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-about.component.html'
})
export class AdminAboutComponent implements OnInit, AfterViewInit {
  @ViewChild('sigCanvas') sigCanvas?: ElementRef<HTMLCanvasElement>;
  private ctx?: CanvasRenderingContext2D;
  private drawing = false;
  private lastPt: { x: number, y: number } | null = null;
  sigDrawMode = false;
  sigPenColor = '#000000';
  sigPenSize = 2.5;
  private api = inject(ApiService);
  private router = inject(Router);
  private toast = inject(ToastService);
  form = { name: '', title: '', bio: '', yearsOfExp: 3, location: '', tagline: '', signature: '', profileImage: '' };
  imageFile?: File;
  imagePreview?: string;
  signatureFile?: File;
  signaturePreview?: string;
  msg = ''; error = ''; loading = false; saving = false;

  ngOnInit() {
    this.loading = true;
    this.api.getAbout().subscribe({
      next: d => {
        if (d) {
          this.form = {
            name: d.name || '',
            title: d.title || '',
            bio: d.bio || '',
            yearsOfExp: d.yearsOfExp ?? 0,
            location: d.location || '',
            tagline: d.tagline || '',
            signature: d.signature || '',
            profileImage: d.profileImage || ''
          };
          if (d.profileImage) this.imagePreview = this.toAssetUrl(d.profileImage);
          if (d.signature) this.signaturePreview = this.toAssetUrl(d.signature);
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    this.imageFile = f;
    const reader = new FileReader();
    reader.onload = ev => this.imagePreview = ev.target?.result as string;
    reader.readAsDataURL(f);
  }

  onSignatureFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    this.signatureFile = f;
    const reader = new FileReader();
    reader.onload = ev => this.signaturePreview = ev.target?.result as string;
    reader.readAsDataURL(f);
  }

  save() {
    this.saving = true; this.msg = ''; this.error = '';
    this.toast.info('Saving changes...');
    const fd = new FormData();
    Object.entries(this.form).forEach(([k, v]) => fd.append(k, String(v)));
    if (this.imageFile) fd.append('profileImage', this.imageFile);
    if (this.signatureFile) fd.append('signature', this.signatureFile);
    this.api.saveAbout(fd).subscribe({
      next: (d) => {
        this.saving = false;
        this.msg = 'Saved successfully!';
        this.toast.success('About section saved!');
        if (d?.profileImage) { this.form.profileImage = d.profileImage; this.imagePreview = this.toAssetUrl(d.profileImage); this.imageFile = undefined; }
        if (d?.signature)    { this.form.signature = d.signature;       this.signaturePreview = this.toAssetUrl(d.signature); this.signatureFile = undefined; }
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        if (err.status === 401) {
          this.error = 'Session expired. Please login again.';
          this.toast.error('Session expired. Please login again.');
          localStorage.removeItem('portfolio_token');
          this.router.navigate(['/login']);
        } else {
          this.error = err.error?.message || 'Save failed.';
          this.toast.error(this.error);
        }
      }
    });
  }

  private toAssetUrl(path: string): string {
    return path.startsWith('http') ? path : `http://localhost:5000${path}`;
  }

  /* ===== Signature drawing pad ===== */
  ngAfterViewInit() {
    this.initSigCanvas();
  }

  toggleSigDraw() {
    this.sigDrawMode = !this.sigDrawMode;
    if (this.sigDrawMode) {
      setTimeout(() => this.initSigCanvas(), 0);
    }
  }

  private initSigCanvas() {
    const canvas = this.sigCanvas?.nativeElement;
    if (!canvas) return;
    // Hi-DPI scale
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.sigPenColor;
    ctx.lineWidth = this.sigPenSize;
    // Transparent background — saved PNG will have alpha
    this.ctx = ctx;
  }

  private posFromEvent(e: MouseEvent | TouchEvent): { x: number, y: number } {
    const canvas = this.sigCanvas!.nativeElement;
    const rect = canvas.getBoundingClientRect();
    if (e instanceof TouchEvent) {
      const t = e.touches[0] || e.changedTouches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  sigStart(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    if (!this.ctx) return;
    this.drawing = true;
    this.lastPt = this.posFromEvent(e);
    this.ctx.strokeStyle = this.sigPenColor;
    this.ctx.lineWidth = this.sigPenSize;
  }

  sigMove(e: MouseEvent | TouchEvent) {
    if (!this.drawing || !this.ctx || !this.lastPt) return;
    e.preventDefault();
    const p = this.posFromEvent(e);
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastPt.x, this.lastPt.y);
    this.ctx.lineTo(p.x, p.y);
    this.ctx.stroke();
    this.lastPt = p;
  }

  sigEnd(e: MouseEvent | TouchEvent) {
    if (e) e.preventDefault();
    this.drawing = false;
    this.lastPt = null;
  }

  clearSignature() {
    const canvas = this.sigCanvas?.nativeElement;
    if (!canvas || !this.ctx) return;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  applyDrawnSignature() {
    const canvas = this.sigCanvas?.nativeElement;
    if (!canvas) return;
    // Detect if anything was drawn
    const blank = document.createElement('canvas');
    blank.width = canvas.width; blank.height = canvas.height;
    if (canvas.toDataURL() === blank.toDataURL()) {
      this.toast.error('Please draw your signature first');
      return;
    }
    canvas.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], `signature-${Date.now()}.png`, { type: 'image/png' });
      this.signatureFile = file;
      const url = URL.createObjectURL(blob);
      this.signaturePreview = url;
      this.sigDrawMode = false;
      this.toast.success('Signature ready — click Save Changes to upload');
    }, 'image/png');
  }
}
