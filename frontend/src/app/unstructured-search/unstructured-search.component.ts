import { Component } from '@angular/core';
import { User } from '../../kinds';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  ) {}

  editUser(user: User) {
    // to implement
  }

  deleteUser(id: number) {
    // to implement
  }

  addUser() {
    // to implement
  }

  loadSampleDatabase() {
    // to implement
  }
}
