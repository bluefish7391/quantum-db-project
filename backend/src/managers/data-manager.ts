import { ApiResponse, DatabasePage, UnstructuredSearchRequest, UnstructuredSearchResponse, User } from '../../../frontend/src/kinds';
import { DataDao } from '../daos/data-dao';
import { isUserArray } from '../utility-functions';

export class DataManager {
	private dataDao: DataDao;

	constructor(dbPath: string) {
		this.dataDao = new DataDao(dbPath);
	}

	public async getAllUsers(): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.dataDao.getAllUsers((err, rows) => {
				if (err) reject(err);
				else {
					const users: User[] = rows.map((row) => {
						const user = new User();
						user.id = row.id;
						user.name = row.name;
						user.phone = row.phone;
						return user;
					});
					resolve(users);
				}
			});
		});
	}

	public async upsertUser(user: User): Promise<number> {
		return new Promise((resolve, reject) => {
			if (user.id > 0) {
				this.dataDao.updateUser(user, (err) => {
					if (err) reject(err);
					else resolve(user.id);
				});
			} else {
				this.dataDao.insertUser(user, (err, id) => {
					if (err) reject(err);
					else resolve(id!);
				});
			}
		});
	}

	public async clearUsers(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.dataDao.clearUsers((err) => {
				if (err) reject(err);
				else resolve();
			});
		});
	}

	public async checkNameExists(name: string): Promise<boolean> {
		return this.dataDao.checkNameExists(name);
	}

	public async getIDByName(request: UnstructuredSearchRequest): Promise<UnstructuredSearchResponse> {
		try {
			const response = new UnstructuredSearchResponse();

			if (!request.useClassical && !request.useQuantum) {
				response.success = false;
				response.message = UnstructuredSearchResponse.NO_METHOD_SELECTED_MESSAGE;
				return response;
			}

			if (request.useClassical) {
				const start = performance.now();
				const id = await this.dataDao.getIDByName(request.name);
				const end = performance.now();

				response.totalClassicalTime = end - start;
				response.classicIDReported = id;
			}

			response.success = true;
			return response;
		} catch (err) {
			throw err;
		}
	}

	public async deleteUser(id: number): Promise<ApiResponse> {
		return new Promise((resolve, reject) => {
			this.dataDao.deleteUser(id, (err) => {
				if (err) {
					reject({ success: false, message: err.message });
				} else {
					resolve({ success: true, message: 'User deleted successfully' });
				}
			});
		});
	}

	public async getPaginatedUsers(page: number = 1, size: number = 10): Promise<DatabasePage> {
		try {
			const databasePage = new DatabasePage();
			const users = await this.dataDao.getPaginatedUsers(page, size);
			if (!isUserArray(users)) {
				throw new Error('Invalid data format received from database');
			}

			databasePage.users = users;
			databasePage.totalUserCount = await this.dataDao.getTotalUserCount();
			return databasePage;
		} catch (err) {
			throw err;
		}
	}
}