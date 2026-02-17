import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, DatabasePage, GetUsersRequest, UnstructuredSearchRequest, UnstructuredSearchResponse, User } from '../kinds';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private apiUrl = 'http://localhost:3000/api';

	constructor(private http: HttpClient) { }

	// ===============================================================
	// Generic API Methods
	// ===============================================================

	getResponse<T>(endpoint: string): Observable<T> {
		return this.http.get<T>(`${this.apiUrl}/${endpoint}`);
	}

	postResponse<T>(endpoint: string, data: any): Observable<T> {
		return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data);
	}

	// ===============================================================
	// Core Classical Database Operations
	// ===============================================================

	upsertUser(user: User): Observable<User> {
		return this.postResponse<User>('data/upsert-user', user);
	}

	getAllUsers(): Observable<User[]> {
		return this.getResponse<User[]>('data/get-all-users');
	}

	getUsers(getUsersRequest: GetUsersRequest): Observable<DatabasePage> {
		return this.postResponse<DatabasePage>('data/get-paginated-users', getUsersRequest);
	}

	clearUsers(): Observable<ApiResponse> {
		return this.getResponse<ApiResponse>('data/clear-users');
	}

	checkNameExists(name: string): Observable<boolean> {
		return this.getResponse<boolean>(`data/check-name-exists/${name}`);
	}

	deleteUser(id: number): Observable<ApiResponse> {
		return this.http.delete<ApiResponse>(`${this.apiUrl}/data/delete-user/${id}`);
	}

	// ===============================================================
	// Complex Operations
	// ==============================================================

	getIDByName(unstructuredSearchRequest: UnstructuredSearchRequest): Observable<UnstructuredSearchResponse> {
		return this.postResponse<UnstructuredSearchResponse>(`data/get-id-by-name`, unstructuredSearchRequest);
	}

	bulkCreateUsers(users: User[]): Observable<ApiResponse> {
		return this.postResponse<ApiResponse>('data/load-bulk-database', users);
	}
}