const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const redis = require('./config/redisClient'); // Import the Redis client

const app = express();
const db = new sqlite3.Database(':memory:');

app.use(cors());
app.use(express.json());

db.serialize(() => {
  db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT)");
});

app.get('/tasks', async (req, res) => {
  try {
    const cachedTasks = await redis.get('tasks');
    if (cachedTasks) {
      return res.json(JSON.parse(cachedTasks));
    }

    db.all("SELECT * FROM tasks", [], (err, rows) => {
      if (err) {
        res.status(500).send(err.message);
        return;
      }
      redis.set('tasks', JSON.stringify(rows));
      res.json(rows);
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/tasks', (req, res) => {
  const { task } = req.body;
  db.run("INSERT INTO tasks (task) VALUES (?)", [task], function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    redis.del('tasks'); // Invalidate cache
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
    redis.del('tasks'); // Invalidate cache
    res.status(204).send();
  });
});

app.listen(3001, () => {
  console.log('Backend running on http://localhost:3001');
});
