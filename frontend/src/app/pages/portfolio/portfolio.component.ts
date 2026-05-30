import { Component, OnInit, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { ThemeService } from '../../core/services/theme.service';
import { About, Project, Skill, Tool, Education, Experience, Feedback, Contact, SdlcPhase } from '../../core/models';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  theme = inject(ThemeService);

  about?: About;
  projects: Project[] = [];
  skills: Skill[] = [];
  tools: Tool[] = [];
  education: Education[] = [];
  experience: Experience[] = [];
  feedback: Feedback[] = [];
  contact?: Contact;
  sdlc: SdlcPhase[] = [];

  menuOpen = false;
  resumeUrl = '';
  loading = true;
  scrolled = false;
  currentYear = new Date().getFullYear();

  @HostListener('window:scroll')
  onWindowScroll() {
    const y = window.scrollY || window.pageYOffset;
    const newScrolled = y > 40;
    if (newScrolled !== this.scrolled) {
      this.scrolled = newScrolled;
      this.cdr.markForCheck();
    }
  }

  skillCategories: string[] = [];
  skillsByCategory: Record<string, Skill[]> = {};

  private readonly officialLogos: Record<string, string> = {
    'angular': 'https://cdn.simpleicons.org/angular/DD0031',
    'react': 'https://cdn.simpleicons.org/react/61DAFB',
    'javascript': 'https://cdn.simpleicons.org/javascript/F7DF1E',
    'typescript': 'https://cdn.simpleicons.org/typescript/3178C6',
    'node.js': 'https://cdn.simpleicons.org/nodedotjs/339933',
    'nodejs': 'https://cdn.simpleicons.org/nodedotjs/339933',
    'express.js': 'https://cdn.simpleicons.org/express/000000',
    'express': 'https://cdn.simpleicons.org/express/000000',
    'spring boot': 'https://cdn.simpleicons.org/springboot/6DB33F',
    'java': 'https://cdn.simpleicons.org/openjdk/000000',
    'python': 'https://cdn.simpleicons.org/python/3776AB',
    'php': 'https://cdn.simpleicons.org/php/777BB4',
    'c': 'https://cdn.simpleicons.org/c/00599C',
    'c++': 'https://cdn.simpleicons.org/cplusplus/00599C',
    'mysql': 'https://cdn.simpleicons.org/mysql/4479A1',
    'mongodb': 'https://cdn.simpleicons.org/mongodb/47A248',
    'postgresql': 'https://cdn.simpleicons.org/postgresql/4169E1',
    'vscode': 'https://cdn.simpleicons.org/visualstudiocode/007ACC',
    'vs code': 'https://cdn.simpleicons.org/visualstudiocode/007ACC',
    'webstorm': 'https://cdn.simpleicons.org/webstorm/000000',
    'postman': 'https://cdn.simpleicons.org/postman/FF6C37',
    'mysql workbench': 'https://cdn.simpleicons.org/mysql/4479A1',
    'neondb': 'https://cdn.simpleicons.org/neon/00E599',
    'sql server': 'https://cdn.simpleicons.org/microsoftsqlserver/CC2927',
    'clickup': 'https://cdn.simpleicons.org/clickup/7B68EE',
    'draw.io': 'https://cdn.simpleicons.org/diagramsdotnet/F08705'
  };

  ngOnInit() {
    this.resumeUrl = this.api.downloadResume();
    this.loading = true;

    forkJoin({
      about:      this.api.getAbout().pipe(catchError(() => of(undefined))),
      projects:   this.api.getProjects().pipe(catchError(() => of([] as Project[]))),
      skills:     this.api.getSkills().pipe(catchError(() => of([] as Skill[]))),
      tools:      this.api.getTools().pipe(catchError(() => of([] as Tool[]))),
      education:  this.api.getEducation().pipe(catchError(() => of([] as Education[]))),
      experience: this.api.getExperience().pipe(catchError(() => of([] as Experience[]))),
      feedback:   this.api.getFeedback().pipe(catchError(() => of([] as Feedback[]))),
      contact:    this.api.getContact().pipe(catchError(() => of(undefined))),
      sdlc:       this.api.getSdlc().pipe(catchError(() => of([] as SdlcPhase[])))
    }).pipe(
      finalize(() => { this.loading = false; this.cdr.markForCheck(); })
    ).subscribe(res => {
      if (res.about) this.about = res.about;
      this.projects   = res.projects;
      this.skills     = res.skills;
      this.tools      = res.tools;
      this.education  = res.education;
      this.experience = res.experience;
      this.feedback   = res.feedback;
      if (res.contact) this.contact = res.contact;
      this.sdlc       = res.sdlc;

      this.skillCategories = [...new Set(res.skills.map(s => s.category))];
      this.skillsByCategory = this.skillCategories.reduce((acc, cat) => {
        acc[cat] = res.skills.filter(s => s.category === cat);
        return acc;
      }, {} as Record<string, Skill[]>);

      this.cdr.markForCheck();
    });
  }

  getStars(n: number): string {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  getEduByType(type: string): Education[] {
    return this.education.filter(e => e.type === type);
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen = false;
  }

  getSkillLogo(skill: Skill): string | undefined {
    if (skill.icon) return skill.icon;
    return this.findOfficialLogo(skill.name);
  }

  getToolLogo(tool: Tool): string | undefined {
    if (tool.icon) return tool.icon;
    return this.findOfficialLogo(tool.name);
  }

  submitContactForm(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const subject = String(fd.get('subject') || '').trim();
    const message = String(fd.get('message') || '').trim();
    if (!name || !email || !subject || !message) return;

    const to = this.contact?.email || 'imesh.fsd.info@gmail.com';
    const body = `Name: ${name}%0AEmail: ${email}%0A%0A${encodeURIComponent(message)}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;
    form.reset();
  }

  submitFeedbackForm(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const rating = String(fd.get('rating') || '').trim();
    const message = String(fd.get('message') || '').trim();
    if (!name || !rating || !message) return;

    const to = this.contact?.email || 'imesh.fsd.info@gmail.com';
    const subject = `Portfolio Feedback from ${name}`;
    const body = `Name: ${name}%0ARating: ${rating}/5%0A%0A${encodeURIComponent(message)}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;
    form.reset();
  }

  private findOfficialLogo(name: string): string | undefined {
    const key = name.trim().toLowerCase();
    return this.officialLogos[key];
  }
}
