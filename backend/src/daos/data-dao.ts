import sqlite3 from 'sqlite3';

export class DataDao {
  private db: sqlite3.Database;

  constructor(dbPath: string) {
    this.db = new sqlite3.Database(dbPath);
    this.initialize();
  }

  private initialize() {
    this.db.serialize(() => {
      this.db.run('CREATE TABLE IF NOT EXISTS your_table (id INTEGER PRIMARY KEY, data TEXT)');
      this.db.get('SELECT COUNT(*) as count FROM your_table', (err, row) => {
        if (err) return console.error('Error checking table:', err.message);
      });
    });
  }

  public getAllData(callback: (err: Error | null, rows: any[]) => void) {
    this.db.all('SELECT * FROM your_table', callback);
  }
}