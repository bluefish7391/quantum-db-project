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
  ) {}

  editUser(user: User) {
    // to implement
  }

  deleteUser(id: number) {
    // to implement
  }

  addUser() {
    this.apiService.createUser(this.newUser).subscribe((response) => {
      console.log(response);
      // if (response.success) {
      //   this.users.push(this.newUser);
      //   this.newUser = new User();
      // } else {
      //   console.error('Failed to add user:', response.message);
      // }
    });
  }

  loadSampleDatabase() {
    // to implement
  }
}
