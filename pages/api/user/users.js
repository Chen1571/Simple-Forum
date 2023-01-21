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
      const query = 'SELECT username FROM User';
      const values = []; //Used for INSERT (values)
      const [data] = await connection.execute(query, values);
      connection.end();
      res.status(200).json({ results: data });
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
