const express = require('express');
const mysql = require('mysql');

const app = express();

const createUnixSocketPool = async (config) => {
  const dbSocketPath = process.env.DB_SOCKET_PATH || "/cloudsql"

  // Establish a connection to the database
  return await mysql.createPool({
    user: process.env.DB_USER, // e.g. 'my-db-user'
    password: process.env.DB_PASS, // e.g. 'my-db-password'
    database: process.env.DB_NAME, // e.g. 'my-database'
    // If connecting via unix domain socket, specify the path
    socketPath: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    // Specify additional properties here.
    ...config
  });
}

app.get('/', async (req, res) => {
  const config = {};
  const pool = await createUnixSocketPool(config);

  pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) {
      console.log(error);
      res
        .status(500)
        .send('Error in connecting to database.')
        .end();
    } else {
      res
        .status(200)
        .send('Connection to database successful!')
        .end();
    }
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
