import express, { Router, Request, Response } from 'express';
import { QuantumManager } from '../managers/quantum-manager';
import { BaseRouter } from './base-router';

export class QuantumRouter extends BaseRouter {
  private quantumManager: QuantumManager;

  private constructor() {
    super();
    this.quantumManager = new QuantumManager();
  }

  private async runUnstructuredSearch(req: Request, res: Response) {
    const { query } = req.body;
    try {
      //const result = await this.quantumManager.runGroverSearch(query);
      res.json();
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  static buildRouter(): Router {
    const quantumRouter = new QuantumRouter();

    return express.Router()
      .post('/search', quantumRouter.runUnstructuredSearch.bind(quantumRouter));
  }
}