const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jose = require('jose');
import { setCookie } from 'cookies-next';

const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

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
      let query = 'SELECT hashedpass FROM User WHERE username = ?';
      let values = [username];
      let [data] = await connection.execute(query, values);
      if (data.length == 0) {
        res.status(400).send('User does not exist!');
        connection.end();
        return;
      }
      //Needed buf .toString() because 'data' properties stored in buffer
      if (!bcrypt.compareSync(password, data[0].hashedpass.toString())) {
        res.status(400).send('Invalid password.');
        connection.end();
        return;
      }
      connection.end();

      //Successful login here, sign jwt
      const user = { username: username };
      const iat = Math.floor(Date.now() / 1000);
      const exp = iat + 60 * 60; // one hour
      const token = await new jose.SignJWT({ user })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(secret);
      setCookie('token', token, { req, res, maxAge: 60 * 60 * 24 });
      res.status(200).json({ token: token });
    } catch (err) {
      connection.end();
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(400).send('Wrong HTTP method');
  }
}
