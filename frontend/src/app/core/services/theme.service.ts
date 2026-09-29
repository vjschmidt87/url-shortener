import { Injectable, signal, computed } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private theme = signal<Theme>(this.getInitialTheme());
  readonly currentTheme = this.theme.asReadonly();
  readonly isDark = computed(() => this.theme() === 'dark');

  toggleTheme(): void {
    const next: Theme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    localStorage.setItem('url-shortener-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  }

  init(): void {
    document.documentElement.setAttribute('data-theme', this.theme());
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem('url-shortener-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
