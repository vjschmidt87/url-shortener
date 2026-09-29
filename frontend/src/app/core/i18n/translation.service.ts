import { Injectable, signal } from '@angular/core';
import { en } from './en';
import { ptBr } from './pt-br';

export type Lang = 'en' | 'pt-br';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private lang = signal<Lang>(this.getInitialLang());
  readonly currentLang = this.lang.asReadonly();

  t(key: string, params?: Record<string, string | number>): string {
    const translations = this.lang() === 'en' ? en : ptBr;
    let value: string = key.split('.').reduce((obj: any, k: string) => obj?.[k], translations) ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(`{{${k}}}`, String(v));
      });
    }
    return value;
  }

  toggleLang(): void {
    this.setLang(this.lang() === 'en' ? 'pt-br' : 'en');
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
    localStorage.setItem('url-shortener-lang', lang);
  }

  private getInitialLang(): Lang {
    const stored = localStorage.getItem('url-shortener-lang');
    if (stored === 'en' || stored === 'pt-br') return stored;
    return navigator.language.startsWith('pt') ? 'pt-br' : 'en';
  }
}
