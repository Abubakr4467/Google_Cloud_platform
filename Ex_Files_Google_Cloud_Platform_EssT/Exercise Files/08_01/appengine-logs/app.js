'use strict';

const express = require('express');
const app = express();

app.get('/create_a_log', async (req, res) => {

  console.log('Hello cloud logging!');

  res
    .status(200)
    .send('A log has been written.')
    .end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
