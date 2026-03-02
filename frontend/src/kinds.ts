
export class User {
	id: number;
	name: string;
	phone: string;

	constructor(id: number = 0, name: string = '', phone: string = '') {
		this.id = id;
		this.name = name;
		this.phone = phone;
	}
}

export class DatabasePage {
	users: User[] = [];
	totalUserCount: number = 0;
}

export class GetUsersRequest {
	page: number = 1;
	pageSize: number = 10;
}

export class ApiResponse {
	success = false;
	message = '';
}

export class UnstructuredSearchRequest {
	useClassical: boolean = false;
	useQuantum: boolean = false;
	name: string = '';
}

export class UnstructuredSearchResponse extends ApiResponse {
	static NO_METHOD_SELECTED_MESSAGE = 'Please select at least one method (classical or quantum)';

	totalClassicalTime: number | undefined;
	totalQuantumTime: number | undefined;
	classicIDReported: number | undefined;
	quantumIDReported: number | undefined;
}