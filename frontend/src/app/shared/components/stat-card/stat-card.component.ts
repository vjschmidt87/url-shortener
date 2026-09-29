import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stat-card">
      <span class="stat-card__icon">{{ icon }}</span>
      <div class="stat-card__info">
        <span class="stat-card__value">{{ value }}</span>
        <span class="stat-card__label">{{ label }}</span>
      </div>
    </div>
  `,
  styleUrl: './stat-card.component.scss'
})
export class StatCardComponent {
  @Input() icon = '';
  @Input() value: string | number = 0;
  @Input() label = '';
}
