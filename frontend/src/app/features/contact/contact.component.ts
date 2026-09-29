import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '@core/i18n/translation.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="contact">
      <div class="contact__card">
        <h1>{{ t.t('contact.title') }}</h1>
        <p class="contact__sub">{{ t.t('contact.subtitle') }}</p>

        <form (ngSubmit)="send()">
          <div class="form-group">
            <label>{{ t.t('contact.name') }}</label>
            <input type="text" [(ngModel)]="name" name="name" [placeholder]="t.t('contact.namePlaceholder')" required />
          </div>
          <div class="form-group">
            <label>{{ t.t('contact.email') }}</label>
            <input type="email" [(ngModel)]="email" name="email" [placeholder]="t.t('contact.emailPlaceholder')" required />
          </div>
          <div class="form-group">
            <label>{{ t.t('contact.subject') }}</label>
            <input type="text" [(ngModel)]="subject" name="subject" [placeholder]="t.t('contact.subjectPlaceholder')" required />
          </div>
          <div class="form-group">
            <label>{{ t.t('contact.message') }}</label>
            <textarea [(ngModel)]="message" name="message" [placeholder]="t.t('contact.messagePlaceholder')" required></textarea>
          </div>
          <button type="submit" class="btn btn--primary contact__btn">{{ t.t('contact.send') }}</button>
        </form>
      </div>
    </div>
  `,
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  name = '';
  email = '';
  subject = '';
  message = '';

  constructor(public t: TranslationService) {}

  send(): void {
    const body = encodeURIComponent(`Name: ${this.name}\nEmail: ${this.email}\n\n${this.message}`);
    const subj = encodeURIComponent(this.subject);
    window.location.href = `mailto:contact@urlshortener.com?subject=${subj}&body=${body}`;
  }
}
