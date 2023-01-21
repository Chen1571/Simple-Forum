const mysql = require('mysql2/promise');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    try {
      const { id } = req.query;
      let query = `SELECT Post.PK_post, Post.FK_user, Post.title, Post.text, Post.post_date, User.username 
      FROM Post INNER JOIN User ON Post.FK_user=User.PK_user WHERE Post.PK_post=?;`;
      let values = [id];
      const [postResult] = await connection.execute(query, values);

      query = `SELECT Comment.PK_comment, Comment.FK_user, Comment.text, Comment.post_date, User.username 
      FROM Comment INNER JOIN User ON Comment.FK_user=User.PK_user WHERE Comment.FK_post=? ORDER BY Comment.post_date DESC;`;
      values = [id];
      const [postComments] = await connection.execute(query, values);

      connection.end();
      res.status(200).json({ results: { postDetails: postResult, comments: postComments } });
    } catch (err) {
      connection.end();
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(400).send('Wrong HTTP method');
  }
}
