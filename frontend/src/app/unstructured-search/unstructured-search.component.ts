import { ChangeDetectorRef, Component } from '@angular/core';
import { GetUsersRequest, UnstructuredSearchRequest, User } from '../../kinds';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api';
import { concatMap, from, map, Observable, tap, toArray } from 'rxjs';
import { SearchTool } from './search-tool/search-tool';
import { GraphView } from './graph-view/graph-view';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { faker } from '@faker-js/faker';

@Component({
	selector: 'app-unstructured-search',
	imports: [CommonModule, MatPaginator, FormsModule, SearchTool, GraphView],
	templateUrl: './unstructured-search.component.html',
	styleUrl: './unstructured-search.component.scss',
})
export class UnstructuredSearchComponent {
	users$!: Observable<User[]>;
	newUser: User = new User();
	totalUsers = 0;
	pageSize = 10;
	pageIndex = 0;
	gotoPageNumber = 1;

	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef
	) {
		this.newUser.id = -1;
		this.loadUsers();
	}

	private loadUsers() {
		const getUsersRequest = new GetUsersRequest();
		getUsersRequest.page = this.pageIndex + 1;
		getUsersRequest.pageSize = this.pageSize;

		this.users$ = this.apiService.getUsers(getUsersRequest).pipe(
			tap(response => this.totalUsers = response.totalUserCount),
			map(response => response.users)
		);
	}

	onPageChange(event: PageEvent) {
		this.pageIndex = event.pageIndex;
		this.pageSize = event.pageSize;
		this.loadUsers();
	}

	getAllUsers() {
		this.users$ = this.apiService.getAllUsers();
	}

	upsertUser(user?: User) {
		this.apiService.upsertUser(user == undefined ? this.newUser : user).subscribe((response) => {
			this.newUser = new User();
		});
		this.loadUsers();
	}

	onEditClick(user: User) {
		// TODO: make this a more convenient dialogue
		const newName = prompt('Enter new name:', user.name);
		const newPhone = prompt('Enter new phone:', user.phone);
		user.name = newName ? newName : user.name;
		user.phone = newPhone ? newPhone : user.phone;
		console.log('Updating user:', user);
		this.upsertUser(user);
	}

	clearDatabase() {
		this.apiService.clearUsers().subscribe((response) => {
			if (!response.success) {
				console.error('Failed to clear users:', response.message);
			}
		});
		this.loadUsers();
	}
	
	onDeleteClick(userID: number) {
		this.apiService.deleteUser(userID).subscribe((response) => {
			if (!response.success) {
				console.error('Failed to clear users:', response.message);
			}
		});
		this.loadUsers();
	}

	loadLargeSampleDatabase(size: number = 500_000) {
		if (size > 1_000_000) { // Safety cap
			if (!confirm(`Generating ${size} users may take time and resources. Proceed?`)) return;
		}

		const sizes: number[] = [];
		this.apiService.clearUsers().pipe(
			concatMap(() => {
				const batchSize = 1000;
				const batches: User[][] = [];
				for (let i = 0; i < size; i += batchSize) {
					const batch: User[] = [];
					for (let j = 0; j < Math.min(batchSize, size - i); j++) {
						batch.push(new User(-1, faker.person.firstName(), faker.phone.number()));
					}
					batches.push(batch);
				}
				return from(batches).pipe(
					concatMap(batch => this.apiService.bulkCreateUsers(batch).pipe(
						concatMap(result => this.apiService.getDatabaseSize().pipe(
							tap(dbSize => sizes.push(dbSize)),
							map(() => result)
						))
					))
				);
			}),
			toArray(),
			tap(() => this.users$ = this.apiService.getAllUsers())
		).subscribe({
			next: () => {
				console.log(`Large sample of ${size} users loaded`);
				console.log('Database size after each batch (MB):', sizes);
			},
			error: (err) => console.error('Error:', err)
		});
	}

	loadGroverDemo() {
		const demoUsers: User[] = [
			new User(0, 'A1', '11'),
			new User(1, 'B2', '22'),
			new User(2, 'C3', '33'),
			new User(3, 'D4', '44')
		];

		this.apiService.clearUsers().subscribe(() => {
			this.apiService.bulkCreateUsers(demoUsers).subscribe(() => {
				this.loadUsers();
				console.log('Grover demo database loaded (4 users)');
			});
		});
	}

	goToPage() {
		if (this.gotoPageNumber < 1 || this.gotoPageNumber > Math.ceil(this.totalUsers / this.pageSize)) {
			alert('Invalid page number');
			return;
		}
		this.pageIndex = this.gotoPageNumber - 1;
		this.loadUsers();
	}

	// Run data collection for unstructured search
	unstructuredSearchDataCollection() {
		const searchTimesBySize: { [size: number]: number[] } = {};
		const sizesToTest = [10_000, 25_000, 50_000, 100_000, 250_000, 500_000];
		let currentSize = 0;

		this.apiService.clearUsers().pipe(
			concatMap(() => from(sizesToTest)),
			concatMap(size => {
				const usersToAdd = size - currentSize;
				console.log(`Adding ${usersToAdd} users to reach database size: ${size}`);
				const batchSize = 1000;
				const batches: User[][] = [];
				for (let i = 0; i < usersToAdd; i += batchSize) {
					const batch: User[] = [];
					for (let j = 0; j < Math.min(batchSize, usersToAdd - i); j++) {
						batch.push(new User(-1, faker.person.firstName(), faker.phone.number()));
					}
					batches.push(batch);
				}
				currentSize = size;
				return from(batches).pipe(
					concatMap(batch => this.apiService.bulkCreateUsers(batch)),
					toArray(),
					concatMap(() => {
						const searchObservables = [];
						for (let i = 0; i < 1000; i++) {
							const unstructuredSearchRequest = new UnstructuredSearchRequest();
							unstructuredSearchRequest.useClassical = true;
							unstructuredSearchRequest.useQuantum = false;
							unstructuredSearchRequest.name = `name_not_in_db_${i}`;
							searchObservables.push(this.apiService.getIDByName(unstructuredSearchRequest));
						}
						return from(searchObservables).pipe(
							concatMap(obs => obs),
							map(response => response.totalClassicalTime || 0),
							toArray(),
							tap(times => {
								searchTimesBySize[size] = times;
								console.log(`Search times for 1000 searches with database size ${size}:`, times.join('\n'));
							})
						);
					})
				);
			})
		).subscribe({
			next: () => {
				console.log('Data collection complete. Search times by database size:', searchTimesBySize);
			},
			error: (err) => console.error('Error during data collection:', err)
		});
	}
}