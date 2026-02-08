import { Component } from '@angular/core';
import { ApiService } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-tool',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-tool.html',
  styleUrl: './search-tool.scss',
})
export class SearchTool {
  searchName = '';
  searchResult: number | undefined;
  constructor(private apiService: ApiService) { }

  searchUser() {
    // TODO: implement user search
  }
}
