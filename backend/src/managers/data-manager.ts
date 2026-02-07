import { User } from '../../../frontend/src/kinds';
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

  public async createUser(user: User): Promise<number> {
    return new Promise((resolve, reject) => {
      this.dataDao.insertUser(user, (err, id) => {
        if (err) reject(err);
        else resolve(id!);
      });
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
}