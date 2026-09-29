import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CopyButtonComponent } from '../copy-button/copy-button.component';
import { TranslationService } from '@core/i18n/translation.service';
import { ShortUrlResponse } from '@core/services/url.service';

@Component({
  selector: 'app-url-card',
  standalone: true,
  imports: [RouterLink, DatePipe, CopyButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="url-card" [class.inactive]="!url.active">
      <div class="url-card__header">
        <div class="url-card__title-row">
          <h3 class="url-card__title">{{ url.title || url.shortCode }}</h3>
          <span class="url-card__badge" [class.url-card__badge--inactive]="!url.active">
            {{ url.active ? 'Active' : 'Inactive' }}
          </span>
        </div>
        <div class="url-card__short">
          <a [href]="url.shortUrl" target="_blank" class="url-card__link">{{ url.shortUrl }}</a>
          <app-copy-button [text]="url.shortUrl" />
        </div>
        <p class="url-card__original">{{ url.originalUrl }}</p>
      </div>
      <div class="url-card__footer">
        <div class="url-card__stats">
          <span class="url-card__clicks">{{ url.totalClicks }} {{ t.t('dashboard.clicks') }}</span>
          <span class="url-card__date">{{ t.t('dashboard.created') }} {{ url.createdAt | date:'mediumDate' }}</span>
        </div>
        <div class="url-card__actions">
          <a [routerLink]="['/analytics', url.shortCode]" class="btn btn--outline btn--sm">{{ t.t('dashboard.analytics') }}</a>
          <button class="btn btn--outline btn--sm" (click)="onToggle.emit()">
            {{ url.active ? t.t('dashboard.deactivate') : t.t('dashboard.activate') }}
          </button>
          <button class="btn btn--danger btn--sm" (click)="onDelete.emit()">{{ t.t('dashboard.delete') }}</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './url-card.component.scss'
})
export class UrlCardComponent {
  @Input() url!: ShortUrlResponse;
  @Output() onToggle = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();

  constructor(public t: TranslationService) {}
}
