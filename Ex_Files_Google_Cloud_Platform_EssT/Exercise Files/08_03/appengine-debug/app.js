'use strict';

require('@google-cloud/debug-agent').start({serviceContext: {
  enableCanary: false
}, allowExpressions: true });

const express = require('express');
const app = express();

app.get('/', async (req, res) => {
  let response = '';

  const helloArray = ['H', 'e', 'l', 'l', 'o', '!'];

  for (let i = 0; i < helloArray.length; i++) {
    response += helloArray[i];
  }

  res
    .status(200)
    .send(response)
    .end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
