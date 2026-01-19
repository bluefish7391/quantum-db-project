import express from 'express';
import cors from 'cors';
import { DataRouter } from './routers/data-router';
import { QuantumRouter } from './routers/quantum-router';

const app = express();
const port = 3000;
const dbPath = '../../db/quantum.db';

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Expires', '0');
  next();
});

app.use('/api/data', new DataRouter(dbPath).buildRouter());
app.use('/api/quantum', new QuantumRouter().buildRouter());

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));