import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { NotificationService } from '../../services/notification';
import { Course, Student, RegistrationRequest } from '../../models/types.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses implements OnInit {
  searchName: string = '';
  searchId: string = '';
  searchDate: string = '';

  allCourses: Course[] = [];
  filteredCourses: Course[] = [];
  student: Student | null = null;
  currentSortColumn: string = '';
  isAscending: boolean = true;

  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    private notif: NotificationService,
  ) {}

  ngOnInit(): void {
    this.student = this.api.getLoggedInStudent();
    this.loadAllCourses();
  }

  loadAllCourses(): void {
    this.api.getAllCourses().subscribe({
      next: (data: Course[]) => {
        this.allCourses = data;
        this.filteredCourses = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  onSearch(): void {
    this.filteredCourses = this.allCourses.filter((c: Course) => {
      const matchName = c.courseName.toLowerCase().includes(this.searchName.toLowerCase());
      const matchId = this.searchId ? c.courseId.toString().includes(this.searchId) : true;
      const matchDate = this.searchDate ? new Date(c.startDate) >= new Date(this.searchDate) : true;
      return matchName && matchId && matchDate;
    });
  }

  register(courseId: number): void {
    if (!this.student) return;

    const registration: RegistrationRequest = {
      studentId: this.student.id,
      courseId: courseId,
      grade: null,
      registrationDate: new Date().toISOString().split('T')[0],
    };

    this.api.registerToCourse(registration).subscribe({
      next: () => {
        this.notif.show('נרשמת לקורס בהצלחה!');
        this.onSearch();
      },
      error: (err) => {
        const msg =
          err.status === 400 ? 'שגיאה: את/ה כבר רשום/ה לקורס זה.' : 'שגיאה בתקשורת עם השרת.';
        this.notif.show(msg);
      },
    });
  }

  sort(column: string): void {
    if (this.currentSortColumn === column) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortColumn = column;
      this.isAscending = true;
    }

    this.filteredCourses.sort((a: Course, b: Course) => {
      let valueA = a[column];
      let valueB = b[column];

      if (column === 'startDate' || column === 'endDate') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      if (valueA < valueB) return this.isAscending ? -1 : 1;
      if (valueA > valueB) return this.isAscending ? 1 : -1;
      return 0;
    });
    this.cdr.detectChanges();
  }

  getSortIcon(column: string): string {
    if (this.currentSortColumn !== column) return '↕';
    return this.isAscending ? '▲' : '▼';
  }

  onMobileSort(event: Event): void {
    const column = (event.target as HTMLSelectElement).value;
    if (column) this.sort(column);
  }
}
