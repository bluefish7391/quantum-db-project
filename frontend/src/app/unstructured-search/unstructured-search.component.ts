import { Component } from '@angular/core';
import { User } from '../../kinds';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api';
import { concatMap, from, Observable, tap, toArray } from 'rxjs';
import { SearchTool } from './search-tool/search-tool';

@Component({
  selector: 'app-unstructured-search',
  imports: [CommonModule, FormsModule, SearchTool],
  templateUrl: './unstructured-search.component.html',
  styleUrl: './unstructured-search.component.scss',
})
export class UnstructuredSearchComponent {
  users$: Observable<User[]>;
  newUser: User = new User();

  constructor(private apiService: ApiService) {
    this.newUser.id = -1;
    this.users$ = this.apiService.getAllUsers();
  }

  getAllUsers() {
    this.users$ = this.apiService.getAllUsers();
  }

  addUser() {
    this.apiService.createUser(this.newUser).subscribe((response) => {
      this.newUser = new User();
    });
    this.getAllUsers();
  }

  clearDatabase() {
    this.apiService.clearUsers().subscribe((response) => {
      if (!response.success) {
        console.error('Failed to clear users:', response.message);
      }
    });
    this.getAllUsers();
  }

  loadSampleDatabase() {
    // TODO: implement this
  }

  editUser(user: User) {
    // TODO: implement this
  }

  deleteUser(userID: number) {
    // TODO: implement this
  }

  checkNameExists() {
    // TODO: implement UI for this, replace placeholder
    this.apiService.checkNameExists("Bob").subscribe((exists) => {
      console.log('Does Bob exist?', exists);
    });
  }
}