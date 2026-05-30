import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private auth = inject(AuthService);
  toast = inject(ToastService);
  sidebarOpen = false;

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
  ];

  logout() { this.auth.logout(); }
}
