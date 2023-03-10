'use strict';

require('@google-cloud/trace-agent').start();

const express = require('express');
const app = express();
const axios = require('axios');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.get('/a_weird_endpoint', async (req, res) => {

  for (let i = 0; i < 10; i++) {
    await sleep(1500);
    try {
      console.log('Requesting data from http://example.com...');
      let response = await axios.get('http://example.com');
      console.log(response.data);
    } catch(err) {
      console.log(err);
    }
  }

  res
    .status(200)
    .send('Done!')
    .end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
