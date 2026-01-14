import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { exec } from 'child_process';

const app = express();
const port = 3000;
const db = new sqlite3.Database('../db/quantum.db');

app.use(cors());
app.use(bodyParser.json());

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS sample_table (id INTEGER PRIMARY KEY, data TEXT)');
  // db.run("INSERT INTO sample_table (data) VALUES ('Sample quantum data 1'), ('Sample quantum data 2')");
});

// Example route: Get all data from DB
app.get('/api/data', (req, res) => {
  db.all('SELECT * FROM your_table', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/quantum/search', (req, res) => {
  const { query } = req.body;
  exec(`python ../quantum/grover.py "${query}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${stderr}`);
      return res.status(500).json({ error: error.message });
    }
    res.json({ result: stdout.trim() });
  });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
