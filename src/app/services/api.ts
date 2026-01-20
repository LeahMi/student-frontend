import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  login(id: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { id, password });
  }

  setLoggedInStudent(authResponse: any) {
    // authResponse הוא האובייקט שחזר מהשרת ומכיל { student: ..., token: ... }
    if (authResponse.token) {
      localStorage.setItem('token', authResponse.token);
    }
    if (authResponse.student) {
      localStorage.setItem('currentStudent', JSON.stringify(authResponse.student));
    } else {
      // למקרה של עדכון פרטים (שם חוזר רק אובייקט הסטודנט)
      localStorage.setItem('currentStudent', JSON.stringify(authResponse));
    }
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getLoggedInStudent() {
    const student = localStorage.getItem('currentStudent');
    return student ? JSON.parse(student) : null;
  }
  updateStudent(student: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/students/update`, student);
  }

  getMyCourses(studentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/students/${studentId}/courses`);
  }

  unregisterCourse(studentId: string, courseId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/courses/unregister`, {
      params: { studentId, courseId },
    });
  }

  getAllCourses(name: string = ''): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courses/search?name=${name}`);
  }

  registerToCourse(registration: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/courses/register`, registration);
  }
}
