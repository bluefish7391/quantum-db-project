import { Component, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnstructuredSearchRequest, UnstructuredSearchResponse } from '../../../kinds';

@Component({
	selector: 'app-search-tool',
	imports: [CommonModule, FormsModule],
	templateUrl: './search-tool.html',
	styleUrl: './search-tool.scss',
})
export class SearchTool {
	searchName = '';
	searchResult: UnstructuredSearchResponse | null = null;
	useClassical = true;
	useQuantum = true;

	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef
	) { }

	searchUser() {
		const unstructuredSearchRequest = new UnstructuredSearchRequest();
		unstructuredSearchRequest.useClassical = this.useClassical;
		unstructuredSearchRequest.useQuantum = this.useQuantum;
		unstructuredSearchRequest.name = this.searchName;

		this.apiService.getIDByName(unstructuredSearchRequest).subscribe((searchResponse) => {
			if (!searchResponse.success) {
				console.log(`Search failed: ${searchResponse.message}`);
				return;
			}

			this.searchResult = searchResponse;
			this.cdr.detectChanges(); // TODO: figure out why this is needed to update the UI, maybe related to change detection strategy
		});
	}
}
