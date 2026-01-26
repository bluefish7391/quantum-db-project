import express, { Router, Request, Response } from 'express';
import { DataManager } from '../managers/data-manager';

export class DataRouter {
  private dataManager: DataManager;

  private constructor(dbPath: string) {
    this.dataManager = new DataManager(dbPath);
  }

  private async getAllData(req: Request, res: Response) {
    try {
      const data = await this.dataManager.getAllData();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  private async createUser(req: Request, res: Response) {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    try {
      //const userId = await this.dataManager.createUser({ name, email });
      res.status(201).json();
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  static buildRouter(dbPath: string): Router {
    const dataRouter = new DataRouter(dbPath);

    return express.Router()
      .get('/get-all-data', dataRouter.getAllData.bind(dataRouter))
      .post('/users', dataRouter.createUser.bind(dataRouter));
  }
}