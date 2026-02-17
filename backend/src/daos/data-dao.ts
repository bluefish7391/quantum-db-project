import sqlite3 from 'sqlite3';
import { User } from '../../../frontend/src/kinds';

export class DataDao {
	private db: sqlite3.Database;

	constructor(dbPath: string) {
		this.db = new sqlite3.Database(dbPath);
		this.initialize();
	}

	private initialize() {
		this.db.serialize(() => {
			this.db.run(`
				CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				phone TEXT NOT NULL UNIQUE
				)
      		`);
			this.db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
				if (err) return console.error('Error checking table:', err.message);
			});
		});
	}

	public getAllUsers(callback: (err: Error | null, rows: any[]) => void) {
		this.db.all('SELECT * FROM users', callback);
	}

	public insertUser(user: User, callback: (err: Error | null, id?: number) => void) {
		this.db.run(
			'INSERT INTO users (name, phone) VALUES (?, ?)',
			[user.name, user.phone],
			function (err) {
				if (err) {
					callback(err);
				} else {
					callback(null, this.lastID);
				}
			}
		);
	}

	public updateUser(user: User, callback: (err: Error | null) => void) {
		this.db.run(
			'UPDATE users SET name = ?, phone = ? WHERE id = ?',
			[user.name, user.phone, user.id],
			callback
		);
	}

	public clearUsers(callback: (err: Error | null) => void) {
		this.db.serialize(() => {
			this.db.run('DELETE FROM users', (err) => {
				if (err) return callback(err);
			});

			this.db.run("DELETE FROM sqlite_sequence WHERE name='users'", (err) => {
				callback(err);
			});
		});
	}

	public checkNameExists(name: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.db.get(
				'SELECT COUNT(*) as count FROM users WHERE name = ?',
				[name],
				(err, row: { count: number }) => {
					if (err) {
						reject(err);
					} else {
						resolve(row.count > 0);
					}
				}
			);
		});
	}

	public getIDByName(name: string): Promise<number | undefined> {
		return new Promise((resolve, reject) => {
			this.db.get(
				'SELECT id FROM users WHERE name = ?',
				[name],
				(err, row: { id: number }) => {
					if (err) {
						reject(err);
					} else {
						if (row) {
							resolve(row.id);
						} else {
							resolve(undefined);
						}
					}
				}
			);
		});
	}

	public deleteUser(id: number, callback: (err: Error | null, response?: any) => void) {
		this.db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
			if (err) {
				callback(err);
			} else {
				if (this.changes > 0) {
					callback(null, { success: true, message: 'User deleted' });
				} else {
					callback(null, { success: false, message: 'User not found' });
				}
			}
		});
	}

	public getPaginatedUsers(page: number, size: number): Promise<any[]> {
		return new Promise((resolve, reject) => {
			const offset = (page - 1) * size;
			this.db.all('SELECT * FROM users LIMIT ? OFFSET ?', [size, offset], (err, rows) => {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}

	public getTotalUserCount(): Promise<number> {
		return new Promise((resolve, reject) => {
			this.db.get('SELECT COUNT(*) as count FROM users', (err, row: { count: number }) => {
				if (err) return reject(err);
				resolve(row.count);
			});
		});
	}

	public bulkInsertUsers(users: { name: string; phone: string }[]): Promise<void> {
		return new Promise((resolve, reject) => {
			this.db.serialize(() => {
				this.db.run('BEGIN TRANSACTION');
				const stmt = this.db.prepare('INSERT INTO users (name, phone) VALUES (?, ?)');
				users.forEach(user => stmt.run(user.name, user.phone));
				stmt.finalize();
				this.db.run('COMMIT', (err) => {
					if (err) reject(err);
					else resolve();
				});
			});
		});
	}
}