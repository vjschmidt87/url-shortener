import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token = signal<string | null>(localStorage.getItem('url-shortener-token'));
  private username = signal<string | null>(localStorage.getItem('url-shortener-username'));
  readonly isAuthenticated = computed(() => !!this.token());
  readonly currentUsername = this.username.asReadonly();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', { username, password }).pipe(
      tap(res => this.setSession(res))
    );
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/register', { username, email, password }).pipe(
      tap(res => this.setSession(res))
    );
  }

  logout(): void {
    this.token.set(null);
    this.username.set(null);
    localStorage.removeItem('url-shortener-token');
    localStorage.removeItem('url-shortener-username');
  }

  getToken(): string | null {
    return this.token();
  }

  private setSession(res: AuthResponse): void {
    this.token.set(res.token);
    this.username.set(res.username);
    localStorage.setItem('url-shortener-token', res.token);
    localStorage.setItem('url-shortener-username', res.username);
  }
}
