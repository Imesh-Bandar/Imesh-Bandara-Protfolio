import { Injectable, signal } from '@angular/core';

export interface ToastMsg {
  id: number;
  type: 'success' | 'error' | 'info';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  toasts = signal<ToastMsg[]>([]);

  success(text: string) { this.push('success', text); }
  error(text: string)   { this.push('error', text); }
  info(text: string)    { this.push('info', text); }

  private push(type: ToastMsg['type'], text: string) {
    const id = this.nextId++;
    this.toasts.update(arr => [...arr, { id, type, text }]);
    setTimeout(() => this.dismiss(id), type === 'error' ? 5000 : 2800);
  }

  dismiss(id: number) {
    this.toasts.update(arr => arr.filter(t => t.id !== id));
  }
}
