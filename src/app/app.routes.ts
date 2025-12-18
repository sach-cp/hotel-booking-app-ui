import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Homepage } from './homepage/homepage';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', title: 'Login', component: Login },
  { path: 'signup', title: 'Sign Up', component: Signup },
  { path: 'home', title: 'Home Page', component: Homepage },
];
