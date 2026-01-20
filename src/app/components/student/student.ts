import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student.html',
  styleUrl: './student.css',
})
export class Student implements OnInit {
  student: any = {}; // לנתונים שמוצגים בכותרת (הנתונים ה"רשמיים")
  editForm: any = {};
  myCourses: any[] = [];
  message = '';
  errors: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };
  isPasswordVisible: boolean = false;

  constructor(
    private api: Api,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notif: NotificationService,
  ) {}

  ngOnInit() {
    const savedStudent = localStorage.getItem('currentStudent');
    if (savedStudent) {
      this.student = JSON.parse(savedStudent);
      this.editForm = { ...this.student };
      if (this.student.id) {
        this.loadCourses();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadCourses() {
    this.api.getMyCourses(this.student.id).subscribe({
      next: (data) => {
        this.myCourses = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('שגיאה בטעינת קורסים:', err);
      },
    });
  }

  clearErrors() {
    this.errors = { firstName: '', lastName: '', email: '', password: '' };
  }

  updateProfile() {
    // בדיקת תקינות (Validations)
    this.clearErrors();
    let hasError = false;

    // ולידציה לשם פרטי ומשפחה (עברית בלבד, מעל 2 אותיות)
    const nameRegex = /^[א-ת\s]{2,}$/;
    if (!nameRegex.test(this.editForm.firstName)) {
      this.errors.firstName = 'שם פרטי חייב להיות בעברית (לפחות 2 אותיות)';
      hasError = true;
    }
    if (!nameRegex.test(this.editForm.lastName)) {
      this.errors.lastName = 'שם משפחה חייב להיות בעברית (לפחות 2 אותיות)';
      hasError = true;
    }

    // ולידציה לאימייל
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editForm.email)) {
      this.errors.email = 'כתובת אימייל אינה תקינה';
      hasError = true;
    }

    // ולידציה לסיסמה (מעל 5 תווים, אותיות ומספרים)
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passRegex.test(this.editForm.password)) {
      this.errors.password = 'סיסמה חייבת להכיל לפחות 6 תווים, אותיות ומספרים';
      hasError = true;
    }

    if (hasError) {
      this.cdr.detectChanges();
      return;
    }
    this.api.updateStudent(this.editForm).subscribe(() => {
      this.student = { ...this.editForm };
      this.api.setLoggedInStudent(this.student);
      this.notif.show('הנתונים עודכנו בהצלחה!');
      this.cdr.detectChanges();
    });
  }

  unregister(courseId: number, startDate: string) {
    const start = new Date(startDate);
    const now = new Date();

    if (start <= now) {
      this.notif.show('לא ניתן לבטל רישום לקורס שכבר התחיל');
      return;
    }

    this.api.unregisterCourse(this.student.id, courseId).subscribe(() => {
      this.notif.show('ביטול הקורס בוצע בהצלחה');
      this.loadCourses(); // רענון הטבלה
    });
  }

  goToCourses() {
    this.router.navigate(['/courses']);
  }
}
