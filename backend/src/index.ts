import express from 'express';
import cors from 'cors';
import path from 'path';
import { DataRouter } from './routers/data-router';
import { QuantumRouter } from './routers/quantum-router';

const app = express();
const port = 3000;
const dbPath = path.join(__dirname, '../../db/quantum.db');

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Expires', '0');
  next();
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
app.use('/api/data', DataRouter.buildRouter(dbPath));
app.use('/api/quantum', QuantumRouter.buildRouter());

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));