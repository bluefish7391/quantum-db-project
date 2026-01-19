import express, { Router } from 'express';
import { QuantumManager } from '../managers/quantum-manager';

export class QuantumRouter {
  private router: Router;
  private quantumManager: QuantumManager;

  constructor() {
    this.router = express.Router();
    this.quantumManager = new QuantumManager();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post('/search', async (req, res) => {
      const { query } = req.body;
      try {
        const result = await this.quantumManager.runGroverSearch(query);
        res.json({ result });
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    });
  }

  public buildRouter(): Router {
    return this.router;
  }
}