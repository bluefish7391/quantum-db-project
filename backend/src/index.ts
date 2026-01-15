import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { exec } from 'child_process';
import { DataRouter } from './routers/data-router';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Expires', '0');
  next();
});

app.use('/api/data', new DataRouter().buildRouter());
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));


// app.get('/api/data', (req, res) => {
//   db.all('SELECT * FROM your_table', (err, rows) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(rows);
//   });
// });

// app.post('/api/quantum/search', (req, res) => {
//   const { query } = req.body;
//   exec(`python ../quantum/grover.py "${query}"`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error executing script: ${stderr}`);
//       return res.status(500).json({ error: error.message });
//     }
//     res.json({ result: stdout.trim() });
//   });
// });
