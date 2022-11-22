const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();
const cors = require('cors')

const PORT = process.env.PORT || 8080;

const db = new sqlite3.Database('data-article.db');
db.run(
  'CREATE TABLE IF NOT EXISTS article (article_id TEXT PRIMARY KEY, article_title TEXT, article_content TEXT, article_release_date TEXT, article_source TEXT, article_rating INTEGER, article_category TEXT, article_image_url TEXT)'
);

app.use(express.json());


app.use(cors())


app.get('/', (req, res) => {
  res.send('Hello article');
});

app.get('/article', (req, res) => {
  db.all('SELECT * FROM article', (err, data) => {
    if (err) {
      res.send(err.message);
      return;
    }
    res.send(data);
  });
});

app.post('/article', (req, res) => {
  db.run(
    'INSERT INTO article (article_id, article_title, article_content, article_release_date, article_source, article_rating, article_category, article_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [req.body.article_id, req.body.article_title, req.body.article_content, req.body.article_release_date, req.body.article_source, req.body.article_rating, req.body.article_category, req.body.article_image_url],
    function (err) {
      if (err) {
        res.send(err.message);
        return;
      }
      console.log(`Inserted ${this.changes} record`);
      res.status(201);
      res.send('---Insert Succeed---');
      res.end();
    }
  );
});

app.delete('/article/:id', (req, res) => {
    db.run('DELETE FROM article WHERE article_id=?', [req.params.id], 
    function (err) {
        if(err) {
            res.send(err.message)
            return;
        }
        console.log(`DELETE ${this.changes} record`)
        res.status(204)
        res.send('---Delete Succeed---');
        res.end()
    })
})

// example for detail
app.get('/article/test/detail/:id', (req, res) => {
  db.all('SELECT * FROM article WHERE article_id=?', [req.params.id], (err, data) => {
    if (err) {
      res.send(err.message);
      return;
    }
    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log('server started at:', PORT);
});
