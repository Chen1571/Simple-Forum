const mysql = require('mysql2/promise');
import { getCookie } from 'cookies-next';
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    //Verify jwt
    const token = getCookie('token', { req, res });
    if (!token) {
      return res.status(400).send('Not authorized to post!');
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      console.error(err);
      return res.status(400).send('Bad cookie!');
    }
    //Pass authentication, insert post into database
    const { postTitle, postText } = req.body;
    const postAuthor = jwt.decode(token).user.username;

    if (!postTitle.match(/\S/) || !postText.match(/\S/)) {
      res.status(400).send('Post title or text cannot be empty!');
      return;
    }

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    try {
      let query = `SELECT PK_user from User where username=?;`;
      let values = [postAuthor];
      let [userPk] = await connection.execute(query, values);
      userPk = userPk[0].PK_user;

      query = `INSERT INTO Post (FK_user, title, text) VALUES(?, ?, ?);`;
      values = [userPk, postTitle, postText];
      const [data] = await connection.execute(query, values);

      if (data.affectedRows == 0) {
        res.status(400).send('Error adding post!');
        connection.end();
        return;
      }

      connection.end();
      res.status(200).send('Post created');
    } catch (err) {
      connection.end();
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(400).send('Wrong HTTP method');
  }
}
