import { ChangeDetectorRef, Component } from '@angular/core';
import { GetUsersRequest, User } from '../../kinds';
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

	loadSampleDatabase() {
		const sampleUsers: User[] = [
			new User(-1, 'Alice', '123'),
			new User(-1, 'Bob', '234'),
			new User(-1, 'Charlie', '345'),
			new User(-1, 'David', '456'),
			new User(-1, 'Eve', '567'),
			new User(-1, 'Frank', '678'),
			new User(-1, 'Grace', '789'),
			new User(-1, 'Henry', '890'),
			new User(-1, 'Ivy', '901'),
			new User(-1, 'Jack', '012'),
		];

		this.apiService.clearUsers().pipe(
			concatMap(() => from(sampleUsers).pipe(
				concatMap(user => this.apiService.upsertUser(user))
			)),
			toArray(),
			tap(() => {
				this.users$ = this.apiService.getAllUsers();
			})
		).subscribe({
			next: () => {
				console.log('Sample database with 10 users loaded successfully');
				this.cdr.detectChanges();
			},
			error: (err) => {
				console.error('Error loading sample database:', err);
				this.users$ = this.apiService.getAllUsers();
			}
		});
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

	goToPage() {
		if (this.gotoPageNumber < 1 || this.gotoPageNumber > Math.ceil(this.totalUsers / this.pageSize)) {
			alert('Invalid page number');
			return;
		}
		this.pageIndex = this.gotoPageNumber - 1;
		this.loadUsers();
	}
}