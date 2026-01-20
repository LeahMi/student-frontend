import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // מאפשר שימוש ב-if ו-for ב-HTML
import { FormsModule } from '@angular/forms'; // מאפשר שימוש ב-ngModel (קלט מהמשתמש)
import { Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // חייבים להוסיף אותם כאן
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  studentId = '';
  password = '';
  errorMessage = '';
  hidePassword: boolean = true;

  constructor(
    private api: Api,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  onLogin() {
    this.errorMessage = '';

    // בדיקת תקינות מבנית
    if (!this.studentId || this.studentId.length !== 9) {
      this.errorMessage = 'תעודת זהות חייבת להכיל 9 ספרות';
      this.cdr.detectChanges();
      return;
    }

    if (!this.validateIsraeliID(this.studentId)) {
      this.errorMessage = 'מספר תעודת הזהות אינו תקין (ספרת ביקורת שגויה)';
      this.cdr.detectChanges();
      return;
    }

    this.api.login(this.studentId, this.password).subscribe({
      next: (response) => {
        this.api.setLoggedInStudent(response);
        this.router.navigate(['/student']);
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else if (typeof err.error === 'string' && err.error.includes('{')) {
          // טיפול במקרה שהשרת מחזיר JSON כטקסט
          const parsed = JSON.parse(err.error);
          this.errorMessage = parsed.message;
        } else {
          this.errorMessage = 'שגיאת התחברות, נסה שנית מאוחר יותר';
        }

        console.error(err);
        this.cdr.detectChanges(); // <--- פקודת הקסם שמרעננת את ה-UI מיד!
      },
    });
  }

  validateIsraeliID(id: string): boolean {
    id = String(id).trim();
    if (id.length > 9 || isNaN(Number(id))) return false;
    id = id.padStart(9, '0');

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let digit = Number(id.charAt(i));
      let step = digit * ((i % 2) + 1);
      if (step > 9) step -= 9;
      sum += step;
    }
    return sum % 10 === 0;
  }
}
