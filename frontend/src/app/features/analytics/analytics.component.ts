import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StatCardComponent } from '@shared/components/stat-card/stat-card.component';
import { TranslationService } from '@core/i18n/translation.service';
import { AnalyticsService, AnalyticsResponse } from '@core/services/analytics.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [RouterLink, DatePipe, StatCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="analytics">
      <a routerLink="/dashboard" class="analytics__back">&larr; {{ t.t('analytics.back') }}</a>

      @if (data()) {
        <h1 class="analytics__title">{{ t.t('analytics.title') }}</h1>

        <div class="analytics__summary">
          <app-stat-card icon="👆" [value]="data()!.totalClicks" [label]="t.t('analytics.totalClicks')" />
        </div>

        <section class="analytics__section">
          <h2>{{ t.t('analytics.clicksOverTime') }}</h2>
          <div class="analytics__chart">
            @for (day of data()!.clicksByDay; track day.date) {
              <div class="bar-group">
                <div class="bar" [style.height.%]="barHeight(day.count)">
                  <span class="bar__value">{{ day.count }}</span>
                </div>
                <span class="bar__label">{{ day.date | date:'MM/dd' }}</span>
              </div>
            }
          </div>
        </section>

        <div class="analytics__grid">
          <section class="analytics__section">
            <h2>{{ t.t('analytics.browsers') }}</h2>
            <div class="analytics__list">
              @for (item of data()!.clicksByBrowser; track item.name) {
                <div class="analytics__list-item">
                  <span>{{ item.name }}</span>
                  <span class="analytics__list-count">{{ item.count }}</span>
                </div>
              }
            </div>
          </section>

          <section class="analytics__section">
            <h2>{{ t.t('analytics.operatingSystems') }}</h2>
            <div class="analytics__list">
              @for (item of data()!.clicksByOs; track item.name) {
                <div class="analytics__list-item">
                  <span>{{ item.name }}</span>
                  <span class="analytics__list-count">{{ item.count }}</span>
                </div>
              }
            </div>
          </section>

          <section class="analytics__section">
            <h2>{{ t.t('analytics.countries') }}</h2>
            <div class="analytics__list">
              @for (item of data()!.clicksByCountry; track item.name) {
                <div class="analytics__list-item">
                  <span>{{ item.name }}</span>
                  <span class="analytics__list-count">{{ item.count }}</span>
                </div>
              }
            </div>
          </section>
        </div>

        <section class="analytics__section">
          <h2>{{ t.t('analytics.recentClicks') }}</h2>
          <div class="analytics__table">
            @for (click of data()!.recentClicks; track $index) {
              <div class="analytics__table-row">
                <span>{{ click.clickedAt | date:'medium' }}</span>
                <span>{{ click.browser }}</span>
                <span>{{ click.os }}</span>
                <span>{{ click.country }}</span>
              </div>
            }
          </div>
        </section>
      } @else {
        <p class="analytics__loading">{{ t.t('common.loading') }}</p>
      }
    </div>
  `,
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements OnInit {
  data = signal<AnalyticsResponse | null>(null);
  private maxClicks = 0;

  constructor(
    public t: TranslationService,
    private analyticsService: AnalyticsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('shortCode')!;
    this.analyticsService.getAnalytics(code).subscribe({
      next: data => {
        this.maxClicks = Math.max(...data.clicksByDay.map(d => d.count), 1);
        this.data.set(data);
      }
    });
  }

  barHeight(count: number): number {
    return (count / this.maxClicks) * 100;
  }
}
