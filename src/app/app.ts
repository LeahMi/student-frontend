import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from './services/notification';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html', // הפניה לקובץ חיצוני
  styleUrl: './app.css', // הפניה לקובץ חיצוני
})
export class App {
  constructor(public notif: NotificationService) {}
}
