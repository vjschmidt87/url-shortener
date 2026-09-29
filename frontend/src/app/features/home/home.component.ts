import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '@shared/components/copy-button/copy-button.component';
import { TranslationService } from '@core/i18n/translation.service';
import { UrlService, ShortUrlResponse, ShortenRequest } from '@core/services/url.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CopyButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="home">
      <section class="hero">
        <h1 class="hero__title">{{ t.t('home.hero') }}</h1>
        <p class="hero__sub">{{ t.t('home.heroSub') }}</p>
      </section>

      <section class="shorten-form">
        <div class="shorten-form__card">
          <div class="form-group">
            <input
              type="url"
              [(ngModel)]="url"
              [placeholder]="t.t('home.placeholder')"
              class="shorten-form__input"
              (keyup.enter)="shorten()" />
          </div>
          <div class="shorten-form__options">
            <div class="form-group">
              <input type="text" [(ngModel)]="customAlias" [placeholder]="t.t('home.customAlias')" />
            </div>
            <div class="form-group">
              <input type="text" [(ngModel)]="title" [placeholder]="t.t('home.title')" />
            </div>
          </div>
          <button class="btn btn--primary shorten-form__btn" (click)="shorten()" [disabled]="loading()">
            {{ loading() ? t.t('home.shortening') : t.t('home.shorten') }}
          </button>

          @if (result()) {
            <div class="shorten-form__result">
              <span class="shorten-form__result-label">{{ t.t('home.result') }}</span>
              <div class="shorten-form__result-row">
                <a [href]="result()!.shortUrl" target="_blank" class="shorten-form__result-link">{{ result()!.shortUrl }}</a>
                <app-copy-button [text]="result()!.shortUrl" />
              </div>
            </div>
          }

          @if (error()) {
            <p class="shorten-form__error">{{ error() }}</p>
          }
        </div>
      </section>

      <section class="features">
        <h2 class="features__title">{{ t.t('home.features') }}</h2>
        <div class="features__grid">
          <div class="features__card">
            <span class="features__icon">⚡</span>
            <h3>{{ t.t('home.feature1Title') }}</h3>
            <p>{{ t.t('home.feature1Desc') }}</p>
          </div>
          <div class="features__card">
            <span class="features__icon">📊</span>
            <h3>{{ t.t('home.feature2Title') }}</h3>
            <p>{{ t.t('home.feature2Desc') }}</p>
          </div>
          <div class="features__card">
            <span class="features__icon">🏷️</span>
            <h3>{{ t.t('home.feature3Title') }}</h3>
            <p>{{ t.t('home.feature3Desc') }}</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  url = '';
  customAlias = '';
  title = '';
  loading = signal(false);
  result = signal<ShortUrlResponse | null>(null);
  error = signal<string | null>(null);

  constructor(public t: TranslationService, private urlService: UrlService) {}

  shorten(): void {
    if (!this.url.trim()) return;
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    const request: ShortenRequest = { url: this.url };
    if (this.customAlias.trim()) request.customAlias = this.customAlias.trim();
    if (this.title.trim()) request.title = this.title.trim();

    this.urlService.shorten(request).subscribe({
      next: res => {
        this.result.set(res);
        this.loading.set(false);
        this.url = '';
        this.customAlias = '';
        this.title = '';
      },
      error: err => {
        this.error.set(err.error?.message || 'Failed to shorten URL');
        this.loading.set(false);
      }
    });
  }
}
