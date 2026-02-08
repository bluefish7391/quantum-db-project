import { Component, ChangeDetectorRef } from '@angular/core';
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
  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  searchUser() {
    this.apiService.checkNameExists(this.searchName).subscribe((exists) => {
      this.searchResult = exists ? 1 : 0;
      this.cdr.detectChanges(); // TODO: figure out why this is needed to update the UI, maybe related to change detection strategy
    });
  }
}
