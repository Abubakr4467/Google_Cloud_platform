'use strict';

const express = require('express');
const app = express();
app.enable('trust proxy');

var bodyParser = require('body-parser');

const project = 'my-pet-project-285907'; // Your GCP Project id
const location = 'asia-east2'; // The GCP region of your queue

/**
 * Create a task for a given queue with an arbitrary payload.
 */
async function createTask(
  queue = 'default-queue', // Name of your Queue
  payload = null, // The task HTTP request body
  path = '/',
  inSeconds = 0 // Delay in task execution
) {
  const {CloudTasksClient} = require('@google-cloud/tasks');

  // Instantiates a client.
  const client = new CloudTasksClient();

  // Construct the fully qualified queue name.
  const parent = client.queuePath(project, location, queue);

  const task = {
    appEngineHttpRequest: {
      httpMethod: 'POST',
      relativeUri: path,
    },
  };

  if (payload) {
    task.appEngineHttpRequest.body = Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  if (inSeconds) {
    // The time when the task is scheduled to be attempted.
    task.scheduleTime = {
      seconds: inSeconds + Date.now() / 1000,
    };
  }

  console.log('Sending task:');
  console.log(task);
  // Send create task request.
  const request = {parent, task};
  const [response] = await client.createTask(request);
  const name = response.name;
  console.log(`Created task ${name}`);
}

const rawBodySaver = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: function () { return true } }));

app.get('/', async (req, res) => {
  res
    .status(200)
    .send('Hello World!')
    .end();
});

app.get('/create_task', async (req, res) => {
  await createTask('test-queue', { payload: 'hello' }, '/task_endpoint');

  res
    .status(200)
    .send('Task created')
    .end();
});

app.post('/task_endpoint', (req, res) => {
  console.log(req.body);

  res
    .status(200)
    .send('Task processed')
    .end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
