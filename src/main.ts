import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';

import { AppComponent } from './app/app.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', loadComponent: () => import('./app/dashboard/dashboard.component') },
    { path: 'detail/:id', loadComponent: () => import('./app/hero-detail/hero-detail.component') },
    { path: 'heroes', loadComponent: () => import('./app/heroes/heroes.component') },
];

bootstrapApplication(AppComponent, {
    providers: [provideRouter(routes)],
});
