import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messageSource = new BehaviorSubject<string | null>(null);
  message$ = this.messageSource.asObservable();

  show(message: string) {
    this.messageSource.next(message);
    setTimeout(() => this.messageSource.next(null), 3000); // ההודעה תיעלם אחרי 3 שניות
  }
}
