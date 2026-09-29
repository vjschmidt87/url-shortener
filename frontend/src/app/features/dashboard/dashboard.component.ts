import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UrlCardComponent } from '@shared/components/url-card/url-card.component';
import { StatCardComponent } from '@shared/components/stat-card/stat-card.component';
import { TranslationService } from '@core/i18n/translation.service';
import { UrlService, ShortUrlResponse } from '@core/services/url.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, UrlCardComponent, StatCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard">
      <div class="dashboard__header">
        <h1>{{ t.t('dashboard.title') }}</h1>
        <p>{{ t.t('dashboard.subtitle') }}</p>
      </div>

      <div class="dashboard__stats">
        <app-stat-card icon="🔗" [value]="urls().length" [label]="t.t('dashboard.totalUrls')" />
        <app-stat-card icon="👆" [value]="totalClicks()" [label]="t.t('dashboard.totalClicks')" />
        <app-stat-card icon="✅" [value]="activeCount()" [label]="t.t('dashboard.activeLinks')" />
      </div>

      <div class="dashboard__search">
        <input type="text" [(ngModel)]="searchQuery" [placeholder]="t.t('dashboard.search')" />
      </div>

      <div class="dashboard__list">
        @for (url of filteredUrls(); track url.id) {
          <app-url-card [url]="url" (onToggle)="toggle(url)" (onDelete)="remove(url)" />
        } @empty {
          <p class="dashboard__empty">{{ t.t('dashboard.empty') }}</p>
        }
      </div>
    </div>
  `,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  urls = signal<ShortUrlResponse[]>([]);
  searchQuery = '';

  constructor(public t: TranslationService, private urlService: UrlService) {}

  ngOnInit(): void {
    this.load();
  }

  totalClicks(): number {
    return this.urls().reduce((sum, u) => sum + u.totalClicks, 0);
  }

  activeCount(): number {
    return this.urls().filter(u => u.active).length;
  }

  filteredUrls(): ShortUrlResponse[] {
    const q = this.searchQuery.toLowerCase();
    if (!q) return this.urls();
    return this.urls().filter(u =>
      u.originalUrl.toLowerCase().includes(q) ||
      u.shortCode.toLowerCase().includes(q) ||
      (u.title?.toLowerCase().includes(q) ?? false)
    );
  }

  toggle(url: ShortUrlResponse): void {
    this.urlService.toggleActive(url.id).subscribe({
      next: updated => {
        this.urls.update(list => list.map(u => u.id === updated.id ? updated : u));
      }
    });
  }

  remove(url: ShortUrlResponse): void {
    if (!confirm(this.t.t('dashboard.confirmDelete'))) return;
    this.urlService.deleteUrl(url.id).subscribe({
      next: () => {
        this.urls.update(list => list.filter(u => u.id !== url.id));
      }
    });
  }

  private load(): void {
    this.urlService.getUserUrls().subscribe({
      next: urls => this.urls.set(urls)
    });
  }
}
