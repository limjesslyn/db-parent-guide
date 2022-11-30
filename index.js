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

const welcome_msg = 
`<div>
  <div class='header'>
    <h1>Hello Articles</h1>
    <p>This database mainly created for upcoming parent-guide website</p>
  </div>
  <div class='content'>
    <ul>
      <li>To Fetch Article</li>
        <p>Use <strong>/articles</strong></p>
      <li>To Fetch Detail</li>
        <p>Use <strong>/article/detail/:id</strong></p>
    </ul>
  </div>
</div>`
app.get('/', (req, res) => {
  res.send(welcome_msg);
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

// fetch all articles
app.get('/articles', (req, res) => {
  db.all('SELECT * FROM article', (err, data) => {
    if (err) {
      res.send(err.message);
      return;
    }
    res.send(data);
  });
});

// fetch popular articles
app.get('/articles/popular', (req, res) => {
  db.all('SELECT * FROM article where article_rating = 5 LIMIT 3', (err, data) => {
    if (err) {
      res.send(err.message);
      return;
    }
    res.send(data);
  });
});

// fetch recommendation articles
app.get('/articles/recommendation', (req, res) => {
  db.all('SELECT * FROM article where article_rating = 4 LIMIT 6', (err, data) => {
    if (err) {
      res.send(err.message);
      return;
    }
    res.send(data);
  });
});

// fetch detail article
app.get('/article/detail/:id', (req, res) => {
  db.get('SELECT * FROM article WHERE article_id=?', [req.params.id], (err, data) => {
    if (err) {
      res.send(err.message);
      return;
    }
    res.send(data);
  });
});

// update article data
app.patch('/article/update/:id', (req, res) => {
  db.run('UPDATE article SET article_rating=? WHERE article_id=?', [req.body.article_rating, req.params.id], (err, data) => {
    if(err) {
      res.send(err.message);
      return;
    }
    res.send(data);
  })
})

app.listen(PORT, () => {
  console.log('server started at:', PORT);
});
