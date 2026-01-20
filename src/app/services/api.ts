import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Student,
  Course,
  EnrolledCourse,
  AuthResponse,
  RegistrationRequest,
} from '../models/types.model';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  login(id: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, { id, password });
  }

  setLoggedInStudent(authData: AuthResponse | Student) {
    if ('token' in authData && authData.token) {
      localStorage.setItem('token', authData.token);
    }

    const student = 'student' in authData ? authData.student : authData;
    localStorage.setItem('currentStudent', JSON.stringify(student));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getLoggedInStudent(): Student | null {
    const student = localStorage.getItem('currentStudent');
    return student ? JSON.parse(student) : null;
  }

  updateStudent(student: Partial<Student>): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/students/update`, student);
  }

  getMyCourses(studentId: number): Observable<EnrolledCourse[]> {
    return this.http.get<EnrolledCourse[]>(`${this.baseUrl}/students/${studentId}/courses`);
  }

  unregisterCourse(studentId: number, courseId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/courses/unregister`, {
      params: { studentId: studentId.toString(), courseId: courseId.toString() },
    });
  }

  getAllCourses(name: string = ''): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courses/search?name=${name}`);
  }

  registerToCourse(registration: RegistrationRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/courses/register`, registration);
  }
}
