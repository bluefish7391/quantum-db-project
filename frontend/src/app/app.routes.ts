import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UnstructuredSearchComponent } from './unstructured-search/unstructured-search.component';
import { ResultsComponent } from './results/results.component';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'query', component: UnstructuredSearchComponent },
	{ path: 'results', component: ResultsComponent },
	{ path: '**', redirectTo: '', pathMatch: 'full' }
];