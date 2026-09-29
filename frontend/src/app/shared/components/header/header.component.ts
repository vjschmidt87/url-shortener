import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslationService } from '@core/i18n/translation.service';
import { ThemeService } from '@core/services/theme.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="header">
      <div class="header__container">
        <a routerLink="/" class="header__logo">
          <span class="header__logo-icon">🔗</span>
          <span class="header__logo-text">{{ t.t('app.title') }}</span>
        </a>
        <nav class="header__nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">{{ t.t('nav.home') }}</a>
          @if (auth.isAuthenticated()) {
            <a routerLink="/dashboard" routerLinkActive="active">{{ t.t('nav.dashboard') }}</a>
          }
          <a routerLink="/contact" routerLinkActive="active">{{ t.t('nav.contact') }}</a>
        </nav>
        <div class="header__actions">
          <button class="icon-btn lang-btn" (click)="t.toggleLang()" [attr.aria-label]="'Toggle language'">
            {{ t.currentLang() === 'en' ? 'PT-BR' : 'EN' }}
          </button>
          <button class="icon-btn" (click)="theme.toggleTheme()" [attr.aria-label]="'Toggle theme'">
            {{ theme.isDark() ? '☀️' : '🌙' }}
          </button>
          @if (auth.isAuthenticated()) {
            <span class="header__user">{{ auth.currentUsername() }}</span>
            <button class="btn btn--outline btn--sm" (click)="auth.logout()">{{ t.t('nav.logout') }}</button>
          } @else {
            <a routerLink="/login" class="btn btn--outline btn--sm">{{ t.t('nav.login') }}</a>
            <a routerLink="/register" class="btn btn--primary btn--sm">{{ t.t('nav.register') }}</a>
          }
        </div>
      </div>
    </header>
  `,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    public t: TranslationService,
    public theme: ThemeService,
    public auth: AuthService
  ) {}
}
