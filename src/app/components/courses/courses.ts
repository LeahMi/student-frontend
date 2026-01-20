import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses implements OnInit {
  // שדות חיפוש
  searchName: string = '';
  searchId: string = '';
  searchDate: string = '';

  allCourses: any[] = [];
  filteredCourses: any[] = [];
  student: any;
  currentSortColumn: string = '';
  isAscending: boolean = true;

  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    private notif: NotificationService
  ) {}

  ngOnInit() {
    this.student = this.api.getLoggedInStudent();
    this.loadAllCourses(); // יקרא מיד בטעינה
  }

  loadAllCourses() {
    this.api.getAllCourses().subscribe({
      next: (data) => {
        this.allCourses = data;
        this.filteredCourses = [...data];
        this.cdr.detectChanges(); // <--- פקודת קסם: מכריחה את אנגולר לרענן את המסך עכשיו!
      },
      error: (err) => console.error(err),
    });
  }

  onSearch() {
    this.filteredCourses = this.allCourses.filter((c) => {
      const matchName = c.courseName.toLowerCase().includes(this.searchName.toLowerCase());
      const matchId = this.searchId ? c.courseId.toString().includes(this.searchId) : true;
      const matchDate = this.searchDate ? new Date(c.startDate) >= new Date(this.searchDate) : true;
      return matchName && matchId && matchDate;
    });
  }

  register(courseId: number) {
    const registration = {
      studentId: this.student.id,
      courseId: courseId,
      grade: null,
      registrationDate: new Date().toISOString().split('T')[0] 
    };

    this.api.registerToCourse(registration).subscribe({
      next: (res) => {
        this.notif.show('נרשמת לקורס בהצלחה!');
        this.onSearch();
      },
      error: (err) => {
        // רק כאן מציגים הודעת שגיאה
        if (err.status === 400) {
          this.notif.show('שגיאה: את/ה כבר רשום/ה לקורס זה.');
        } else {
          this.notif.show('שגיאה בתקשורת עם השרת.');
        }
        console.error(err);
      },
    });
  }

  // פונקציית מיון פשוטה לפי עמודה
  sort(column: string) {
    // אם לוחצים על אותה עמודה - הופכים את הכיוון. אם עמודה חדשה - מתחילים בעולה.
    if (this.currentSortColumn === column) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortColumn = column;
      this.isAscending = true;
    }

    this.filteredCourses.sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];

      // טיפול בתאריכים (המרה לאובייקט Date לצורך השוואה נכונה)
      if (column === 'startDate' || column === 'endDate') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      if (valueA < valueB) {
        return this.isAscending ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.isAscending ? 1 : -1;
      }
      return 0;
    });

    // חשוב לרענן את התצוגה אחרי המיון
    this.cdr.detectChanges();
  }

  // פונקציה להחזרת אייקון יחיד ודינמי
  getSortIcon(column: string): string {
    if (this.currentSortColumn !== column) return '↕';
    return this.isAscending ? '▲' : '▼';
  }

 onMobileSort(event: any) {
  const column = event.target.value;
  if (column) {
    this.sort(column); // מפעיל את פונקציית המיון הקיימת שלך
  }
}

}
