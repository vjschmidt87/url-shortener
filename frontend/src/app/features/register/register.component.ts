import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslationService } from '@core/i18n/translation.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1>{{ t.t('auth.registerTitle') }}</h1>
        <p class="auth-card__sub">{{ t.t('auth.registerSub') }}</p>

        <div class="form-group">
          <label>{{ t.t('auth.username') }}</label>
          <input type="text" [(ngModel)]="username" />
        </div>
        <div class="form-group">
          <label>{{ t.t('auth.email') }}</label>
          <input type="email" [(ngModel)]="email" />
        </div>
        <div class="form-group">
          <label>{{ t.t('auth.password') }}</label>
          <input type="password" [(ngModel)]="password" />
        </div>
        <div class="form-group">
          <label>{{ t.t('auth.confirmPassword') }}</label>
          <input type="password" [(ngModel)]="confirmPassword" (keyup.enter)="register()" />
        </div>

        @if (error()) {
          <p class="auth-card__error">{{ error() }}</p>
        }

        <button class="btn btn--primary auth-card__btn" (click)="register()" [disabled]="loading()">
          {{ loading() ? t.t('auth.registering') : t.t('auth.register') }}
        </button>

        <p class="auth-card__link">
          {{ t.t('auth.hasAccount') }} <a routerLink="/login">{{ t.t('auth.signIn') }}</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(public t: TranslationService, private auth: AuthService, private router: Router) {}

  register(): void {
    if (!this.username.trim() || !this.email.trim() || !this.password.trim()) return;
    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    this.auth.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.error.set(err.error?.message || 'Registration failed');
        this.loading.set(false);
      }
    });
  }
}
