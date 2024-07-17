const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Import cors
const app = express();
const db = new sqlite3.Database(':memory:');

app.use(cors()); // Use cors middleware
app.use(express.json());

db.serialize(() => {
  db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT)");
});

app.get('/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

app.post('/tasks', (req, res) => {
  const { task } = req.body;
  db.run("INSERT INTO tasks (task) VALUES (?)", [task], function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", [id], function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.status(204).send();
  });
});

app.listen(3001, () => {
  console.log('Backend running on http://localhost:3001');
});
