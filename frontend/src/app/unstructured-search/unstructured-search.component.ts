import { Component } from '@angular/core';
import { User } from '../../kinds';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api';

@Component({
  selector: 'app-unstructured-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './unstructured-search.component.html',
  styleUrl: './unstructured-search.component.scss',
})
export class UnstructuredSearchComponent {
  users: User[] = [];
  newUser: User = new User();
  constructor (
    private apiService: ApiService
  ) {
    this.newUser.id = -1;
  }

  ngOnInit() {
    this.getAllUsers();
  }

  editUser(user: User) {
    // to implement
  }

  deleteUser(id: number) {
    // to implement
  }

  addUser() {
    this.apiService.createUser(this.newUser).subscribe((response) => {
      if (response && response.id !== -1) {
        this.users = [...this.users, response];
        this.newUser.id = -1;
        this.newUser.name = '';
        this.newUser.phone = '';
      } else {
        console.error('Failed to create user:', response);
      }
    });
  }

  getAllUsers() {
    this.apiService.getAllUsers().subscribe((users) => {
      console.log('Fetched users:', users);
      this.users = users;
    })
  }

  loadSampleDatabase() {
    const user1 = new User(0, "Alice", "123");
    const user2 = new User(1, "Bob", "456");
    const user3 = new User(2, "Charlie", "789");
    this.users.push(user1, user2, user3);
  }

  clearDatabase() {
    this.apiService.clearUsers().subscribe((response) => {
      if (!response.success) {
        console.error('Failed to clear users:', response.message);
      }
    });
    this.getAllUsers();
  }
}
