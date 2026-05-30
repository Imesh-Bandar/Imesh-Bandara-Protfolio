import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/portfolio/portfolio.component').then(m => m.PortfolioComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      { path: '', redirectTo: 'about', pathMatch: 'full' },
      { path: 'about',      loadComponent: () => import('./pages/admin/admin-about/admin-about.component').then(m => m.AdminAboutComponent) },
      { path: 'projects',   loadComponent: () => import('./pages/admin/admin-projects/admin-projects.component').then(m => m.AdminProjectsComponent) },
      { path: 'skills',     loadComponent: () => import('./pages/admin/admin-skills/admin-skills.component').then(m => m.AdminSkillsComponent) },
      { path: 'tools',      loadComponent: () => import('./pages/admin/admin-tools/admin-tools.component').then(m => m.AdminToolsComponent) },
      { path: 'education',  loadComponent: () => import('./pages/admin/admin-education/admin-education.component').then(m => m.AdminEducationComponent) },
      { path: 'experience', loadComponent: () => import('./pages/admin/admin-experience/admin-experience.component').then(m => m.AdminExperienceComponent) },
      { path: 'feedback',   loadComponent: () => import('./pages/admin/admin-feedback/admin-feedback.component').then(m => m.AdminFeedbackComponent) },
      { path: 'contact',    loadComponent: () => import('./pages/admin/admin-contact/admin-contact.component').then(m => m.AdminContactComponent) },
      { path: 'resume',     loadComponent: () => import('./pages/admin/admin-resume/admin-resume.component').then(m => m.AdminResumeComponent) },
      { path: 'sdlc',       loadComponent: () => import('./pages/admin/admin-sdlc/admin-sdlc.component').then(m => m.AdminSdlcComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];
