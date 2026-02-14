
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
	totalClassicalTime: number | undefined;
	totalQuantumTime: number | undefined;
	id: number | undefined;
}