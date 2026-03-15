import { Component, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnstructuredSearchRequest, UnstructuredSearchResponse } from '../../../kinds';
import { firstValueFrom } from 'rxjs';

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
	readonly maxQuantumSearchSize = 16;

	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef
	) { }

	async searchUser() {
		const unstructuredSearchRequest = new UnstructuredSearchRequest();
		unstructuredSearchRequest.useClassical = this.useClassical;
		unstructuredSearchRequest.useQuantum = this.useQuantum;
		unstructuredSearchRequest.name = this.searchName;

		if (!this.useClassical && !this.useQuantum) {
			console.log('Please select at least one search method (classical or quantum).');
			return;
		}

		const databaseSize = await firstValueFrom(this.apiService.getDatabaseSize());
		if (databaseSize > this.maxQuantumSearchSize && this.useQuantum) {
			console.log(`Quantum search is not available for databases larger than ${this.maxQuantumSearchSize} entries. Please uncheck the quantum search option.`);
			return;
		}

		this.apiService.getIDByName(unstructuredSearchRequest).subscribe((searchResponse) => {
			if (!searchResponse.success) {
				console.log(`Search failed: ${searchResponse.message}`);
				return;
			}

			this.searchResult = searchResponse;
			this.cdr.detectChanges();
		});
	}
}
