import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, User } from '../kinds';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private apiUrl = 'http://localhost:3000/api';

	constructor(private http: HttpClient) { }

	getResponse<T>(endpoint: string): Observable<T> {
		return this.http.get<T>(`${this.apiUrl}/${endpoint}`);
	}

	postResponse<T>(endpoint: string, data: any): Observable<T> {
		return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data);
	}

	upsertUser(user: User): Observable<User> {
		return this.postResponse<User>('data/upsert-user', user);
	}

	getAllUsers(): Observable<User[]> {
		return this.getResponse<User[]>('data/get-all-users');
	}

	clearUsers(): Observable<ApiResponse> {
		return this.getResponse<ApiResponse>('data/clear-users');
	}

	checkNameExists(name: string): Observable<boolean> {
		return this.getResponse<boolean>(`data/check-name-exists/${name}`);
	}

	getIDByName(name: string): Observable<number> {
		return this.getResponse<number>(`data/get-id-by-name/${name}`);
	}
}