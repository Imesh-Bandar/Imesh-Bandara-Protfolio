import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private api = `${environment.apiBaseUrl}/auth`;

  login(email: string, password: string) {
    return this.http.post<{ token: string; email: string }>(`${this.api}/login`, { email, password }).pipe(
      tap(res => localStorage.setItem('portfolio_token', res.token))
    );
  }

  logout() {
    localStorage.removeItem('portfolio_token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('portfolio_token');
    if (!token) return false;

    if (this.isTokenExpired(token)) {
      localStorage.removeItem('portfolio_token');
      return false;
    }

    return true;
  }

  getToken(): string | null {
    return localStorage.getItem('portfolio_token');
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload?.exp) return false;
      const nowInSeconds = Math.floor(Date.now() / 1000);
      return payload.exp <= nowInSeconds;
    } catch {
      return true;
    }
  }
}
