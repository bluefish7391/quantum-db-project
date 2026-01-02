import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { QueryComponent } from './pages/query/query.component';
import { ResultsComponent } from './pages/results/results.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'query', component: QueryComponent },
  { path: 'results/:id', component: ResultsComponent }, 
  { path: '**', redirectTo: '/home' }
];