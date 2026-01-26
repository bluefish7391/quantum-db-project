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
      this.db.get('SELECT COUNT(*) as count FROM your_table', (err, row) => {
        if (err) return console.error('Error checking table:', err.message);
      });
    });
  }

  public getAllData(callback: (err: Error | null, rows: any[]) => void) {
    this.db.all('SELECT * FROM your_table', callback);
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
}