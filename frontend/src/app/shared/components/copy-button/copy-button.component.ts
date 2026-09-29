import { Component, ChangeDetectionStrategy, Input, signal } from '@angular/core';
import { TranslationService } from '@core/i18n/translation.service';

@Component({
  selector: 'app-copy-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="copy-btn" [class.copied]="copied()" (click)="copy()">
      {{ copied() ? t.t('home.copied') : t.t('home.copy') }}
    </button>
  `,
  styleUrl: './copy-button.component.scss'
})
export class CopyButtonComponent {
  @Input() text = '';
  copied = signal(false);

  constructor(public t: TranslationService) {}

  copy(): void {
    navigator.clipboard.writeText(this.text);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
