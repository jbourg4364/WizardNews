const express = require("express");
const path = require('path');
const morgan = require('morgan');
const postBank = require('./postBank');
const app = express();
const PORT = 1337;




app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {

  const posts = postBank.list();
  
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            <a href="/post/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`;

  res.send(html);

});

app.get('/post/:id', (req, res, next) => {
  const id = req.params.id;
  const post = postBank.find(id);

  if(!post.id) {
    next(err);
  } else {
    res.send(`<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            ${post.title}
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
          <p>${post.content}</p>
        </div>
    </div>
  </body>
</html>`);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(404).send(`page not found, <a href="/">Back to All Posts</a>`);
})

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
 
});


