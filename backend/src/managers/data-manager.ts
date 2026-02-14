import { ApiResponse, UnstructuredSearchRequest, UnstructuredSearchResponse, User } from '../../../frontend/src/kinds';
import { DataDao } from '../daos/data-dao';

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
			const start = performance.now();
			const id = await this.dataDao.getIDByName(request.name);
			const end = performance.now();

			const response = new UnstructuredSearchResponse();
			response.success = true;
			response.message = id >= 0 ? 'ID found' : 'ID not found';
			response.totalClassicalTime = end - start;
			response.id = id;

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
}