import { Component } from '@angular/core';
import { User } from '../../kinds';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-query',
  imports: [CommonModule, FormsModule],
  templateUrl: './query.component.html',
  styleUrl: './query.component.scss',
})
export class QueryComponent {
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
