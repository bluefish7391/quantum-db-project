import express, { Router } from 'express';
import { DataManager } from '../managers/data-manager';

export class DataRouter {
  private router: Router;
  private dataManager: DataManager;

  constructor(dbPath: string) {
    this.router = express.Router();
    this.dataManager = new DataManager(dbPath);
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get('/', async (req, res) => {
      try {
        const data = await this.dataManager.getAllData();
        res.json(data);
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    });

  }

  public buildRouter(): Router {
    return this.router;
  }
}