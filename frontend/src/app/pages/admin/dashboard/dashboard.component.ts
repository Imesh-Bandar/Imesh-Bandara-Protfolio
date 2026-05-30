import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ThemeService } from '../../../core/services/theme.service';
import { TodoWidgetComponent } from '../../../shared/todo-widget/todo-widget.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, TodoWidgetComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  toast = inject(ToastService);
  theme = inject(ThemeService);
  sidebarOpen = false;

  /* ===== Live clock ===== */
  now = signal(new Date());
  private clockTimer?: any;
  adminName = localStorage.getItem('admin_name') || 'Admin';

  ngOnInit() {
    // Align to next second tick, then update every 1s
    const align = 1000 - (Date.now() % 1000);
    setTimeout(() => {
      this.now.set(new Date());
      this.clockTimer = setInterval(() => this.now.set(new Date()), 1000);
    }, align);
  }

  ngOnDestroy() {
    if (this.clockTimer) clearInterval(this.clockTimer);
  }

  get clockTime(): string {
    return this.now().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  }

  get clockDate(): string {
    return this.now().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  navItems = [
    { path: 'about',      label: 'About',      icon: 'person' },
    { path: 'projects',   label: 'Projects',   icon: 'work' },
    { path: 'skills',     label: 'Skills',     icon: 'psychology' },
    { path: 'tools',      label: 'Tools',      icon: 'build' },
    { path: 'sdlc',       label: 'SDLC Process',icon: 'timeline' },
    { path: 'education',  label: 'Education',  icon: 'school' },
    { path: 'experience', label: 'Experience', icon: 'business_center' },
    { path: 'feedback',   label: 'Feedback',   icon: 'star' },
    { path: 'contact',    label: 'Contact',    icon: 'contact_mail' },
    { path: 'resume',     label: 'Resume',     icon: 'description' },
    { path: 'calendar',   label: 'Calendar',   icon: 'calendar_month' },
  ];

  logout() { this.auth.logout(); }
}
