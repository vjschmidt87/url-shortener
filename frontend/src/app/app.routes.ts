import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('@features/home/home.component').then(m => m.HomeComponent) },
  { path: 'dashboard', loadComponent: () => import('@features/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'analytics/:shortCode', loadComponent: () => import('@features/analytics/analytics.component').then(m => m.AnalyticsComponent), canActivate: [authGuard] },
  { path: 'login', loadComponent: () => import('@features/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('@features/register/register.component').then(m => m.RegisterComponent) },
  { path: 'contact', loadComponent: () => import('@features/contact/contact.component').then(m => m.ContactComponent) },
  { path: '**', redirectTo: '' }
];
