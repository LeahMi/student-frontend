import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { StudentComp } from './components/student/student';
import { Courses } from './components/courses/courses';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'student', component: StudentComp },
  { path: 'courses', component: Courses },
];
