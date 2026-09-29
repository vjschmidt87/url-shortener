import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslationService } from '@core/i18n/translation.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1>{{ t.t('auth.loginTitle') }}</h1>
        <p class="auth-card__sub">{{ t.t('auth.loginSub') }}</p>

        <div class="form-group">
          <label>{{ t.t('auth.username') }}</label>
          <input type="text" [(ngModel)]="username" (keyup.enter)="login()" />
        </div>
        <div class="form-group">
          <label>{{ t.t('auth.password') }}</label>
          <input type="password" [(ngModel)]="password" (keyup.enter)="login()" />
        </div>

        @if (error()) {
          <p class="auth-card__error">{{ error() }}</p>
        }

        <button class="btn btn--primary auth-card__btn" (click)="login()" [disabled]="loading()">
          {{ loading() ? t.t('auth.loggingIn') : t.t('auth.login') }}
        </button>

        <p class="auth-card__link">
          {{ t.t('auth.noAccount') }} <a routerLink="/register">{{ t.t('auth.signUp') }}</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(public t: TranslationService, private auth: AuthService, private router: Router) {}

  login(): void {
    if (!this.username.trim() || !this.password.trim()) return;
    this.loading.set(true);
    this.error.set(null);

    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.error.set(err.error?.message || 'Login failed');
        this.loading.set(false);
      }
    });
  }
}
