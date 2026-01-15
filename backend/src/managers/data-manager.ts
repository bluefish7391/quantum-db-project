import { dataDAO } from "../daos/dao-factory";

export class DataManager {
  public async getAllData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      dataDAO.getAllData((err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
  
}