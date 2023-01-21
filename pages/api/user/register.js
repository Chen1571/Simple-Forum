const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const saltRounds = 10;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    try {
      const { username, password } = req.body;
      let query = 'SELECT username FROM User WHERE username = ?';
      let values = [username];
      let [data] = await connection.execute(query, values);
      if (data.length > 0) {
        res.status(400).send('User already registered!');
        connection.end();
        return;
      }
      const hashedPass = bcrypt.hashSync(password, saltRounds);
      query = 'INSERT INTO User (username, hashedpass) VALUES(?,?)';
      values = [username, hashedPass];
      [data] = await connection.execute(query, values);
      if (data.affectedRows == 0) {
        res.status(400).send('Error registering user!');
        connection.end();
        return;
      }
      connection.end();
      res.status(200).send('Successful Register.');
    } catch (err) {
      connection.end();
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
  else {
    res.status(400).send('Wrong HTTP method');
  }
}
