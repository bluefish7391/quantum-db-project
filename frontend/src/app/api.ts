import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../kinds';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api/data';

  constructor(private http: HttpClient) {}

  createUser(user: User): Observable<{ id: number; message: string }> {
    return this.http.post<{ id: number; message: string }>(`${this.apiUrl}/users`, user);
  }
}