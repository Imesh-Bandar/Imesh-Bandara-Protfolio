import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal(true);

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    const saved = localStorage.getItem('theme');
    const isDarkMode = saved ? saved === 'dark' : true;
    this.isDark.set(isDarkMode);
    this.applyTheme(isDarkMode);
  }

  toggle() {
    this.enableTransition();
    this.isDark.update(v => !v);
    this.applyTheme(this.isDark());
  }

  private enableTransition() {
    const html = document.documentElement;
    html.classList.add('theme-transitioning');
    window.clearTimeout((this as any)._transitionTimer);
    (this as any)._transitionTimer = window.setTimeout(() => {
      html.classList.remove('theme-transitioning');
    }, 800);
  }

  private applyTheme(dark: boolean) {
    const html = document.documentElement;
    const body = document.body;

    if (dark) {
      html.setAttribute('data-theme', 'dark');
      body.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
      body.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
}
