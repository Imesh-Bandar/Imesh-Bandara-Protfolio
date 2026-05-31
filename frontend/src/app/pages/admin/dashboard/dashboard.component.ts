import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ThemeService } from '../../../core/services/theme.service';
import { TodoWidgetComponent } from '../../../shared/todo-widget/todo-widget.component';
import { ClockWidgetComponent } from '../../../shared/clock-widget/clock-widget.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, TodoWidgetComponent, ClockWidgetComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private auth = inject(AuthService);
  toast = inject(ToastService);
  theme = inject(ThemeService);
  sidebarOpen = false;
  sidebarCollapsed = localStorage.getItem('admin_sidebar_collapsed') === '1';
  adminName = localStorage.getItem('admin_name') || 'Admin';

  toggleSidebarCollapse() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem('admin_sidebar_collapsed', this.sidebarCollapsed ? '1' : '0');
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
