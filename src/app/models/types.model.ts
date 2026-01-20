export interface Course {
  courseId: number;
  courseName: string;
  startDate: string;
  endDate: string;
  academicYear: string;
  [key: string]: any;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface EnrolledCourse {
  courseId: number;
  courseName: string;
  startDate: string;
  endDate: string;
  grade?: number | null;
}

export interface AuthResponse {
  token: string;
  student: Student;
}

export interface RegistrationRequest {
  studentId: number;
  courseId: number;
  grade: number | null;
  registrationDate: string;
}

export interface FormErrors {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
