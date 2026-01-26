import { User } from '../../../frontend/src/kinds';
import { DataDao } from '../daos/data-dao';

export class DataManager {
  private dataDao: DataDao;

  constructor(dbPath: string) {
    this.dataDao = new DataDao(dbPath);
  }

  public async getAllData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.dataDao.getAllData((err, rows) => {
        if (err) reject(err);
        else resolve(rows);
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
}