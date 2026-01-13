import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { exec } from 'child_process'; // For calling Qiskit scripts

const app = express();
const port = 3000;
const db = new sqlite3.Database('../db/quantum.db'); // Adjust path if db/ is elsewhere; creates the DB if it doesn't exist

app.use(cors()); // Enables CORS for frontend requests
app.use(bodyParser.json()); // Parses JSON request bodies

// Initialize DB schema (run once or on startup)
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS your_table (id INTEGER PRIMARY KEY, data TEXT)');
  // Optional: Insert sample data
  // db.run("INSERT INTO your_table (data) VALUES ('Sample quantum data 1'), ('Sample quantum data 2')");
});

// Example route: Get all data from DB
app.get('/api/data', (req, res) => {
  db.all('SELECT * FROM your_table', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Example route: Run quantum algorithm (e.g., Grover's search via Python script)
app.post('/api/quantum/search', (req, res) => {
  const { query } = req.body;
  // Call the Qiskit script with the query as argument
  exec(`python ../quantum/grover.py "${query}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${stderr}`);
      return res.status(500).json({ error: error.message });
    }
    res.json({ result: stdout.trim() });
  });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
