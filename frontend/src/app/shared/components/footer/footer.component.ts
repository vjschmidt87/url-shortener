import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslationService } from '@core/i18n/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="footer__container">
        <p class="footer__tagline">{{ t.t('footer.tagline') }}</p>
        <p class="footer__copy">&copy; {{ year }} URL Shortener. {{ t.t('footer.rights') }}</p>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  year = new Date().getFullYear();
  constructor(public t: TranslationService) {}
}
