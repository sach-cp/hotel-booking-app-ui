import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';

export const routes: Routes = [
  { path: '', component: Login, },
  { path: 'signup', title: 'Sign Up', component: Signup }
];
