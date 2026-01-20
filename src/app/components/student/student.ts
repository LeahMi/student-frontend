import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { NotificationService } from '../../services/notification';
import { Student, EnrolledCourse, FormErrors } from '../../models/types.model';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student.html',
  styleUrl: './student.css',
})
export class StudentComp implements OnInit {
  student: Student = {} as Student;
  editForm: Student = {} as Student;
  myCourses: EnrolledCourse[] = [];
  errors: FormErrors = { firstName: '', lastName: '', email: '', password: '' };
  isPasswordVisible: boolean = false;

  constructor(
    private api: Api,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notif: NotificationService,
  ) {}

  ngOnInit(): void {
    const savedStudent = this.api.getLoggedInStudent();
    if (savedStudent) {
      this.student = savedStudent;
      this.editForm = { ...this.student };
      this.loadCourses();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadCourses(): void {
    this.api.getMyCourses(this.student.id).subscribe({
      next: (data: EnrolledCourse[]) => {
        this.myCourses = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading courses:', err),
    });
  }

  updateProfile(): void {
    if (!this.validateForm()) return;

    this.api.updateStudent(this.editForm).subscribe(() => {
      this.student = { ...this.editForm };
      this.api.setLoggedInStudent(this.student);
      this.notif.show('הנתונים עודכנו בהצלחה!');
      this.cdr.detectChanges();
    });
  }

  private validateForm(): boolean {
    this.errors = { firstName: '', lastName: '', email: '', password: '' };
    let isValid = true;

    const nameRegex = /^[א-ת\s]{2,}$/;
    if (!nameRegex.test(this.editForm.firstName)) {
      this.errors.firstName = 'שם פרטי חייב להיות בעברית (לפחות 2 אותיות)';
      isValid = false;
    }
    if (!nameRegex.test(this.editForm.lastName)) {
      this.errors.lastName = 'שם משפחה חייב להיות בעברית (לפחות 2 אותיות)';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editForm.email)) {
      this.errors.email = 'כתובת אימייל אינה תקינה';
      isValid = false;
    }

    if (this.editForm.password) {
      const passRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
      if (!passRegex.test(this.editForm.password)) {
        this.errors.password = 'סיסמה חייבת להכיל לפחות 6 תווים, אותיות ומספרים';
        isValid = false;
      }
    }

    if (!isValid) this.cdr.detectChanges();
    return isValid;
  }

  unregister(courseId: number, startDate: string): void {
    if (new Date(startDate) <= new Date()) {
      this.notif.show('לא ניתן לבטל רישום לקורס שכבר התחיל');
      return;
    }

    this.api.unregisterCourse(this.student.id, courseId).subscribe(() => {
      this.notif.show('ביטול הקורס בוצע בהצלחה');
      this.loadCourses();
    });
  }

  goToCourses(): void {
    this.router.navigate(['/courses']);
  }
}
