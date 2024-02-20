require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const DataEntry = require('./dataEntryModel');
require('./db');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

/* The code snippet `app.use((req, res, next) => { ... })` is creating a middleware function in the
Express application. This middleware function is designed to measure the response time for each
incoming request. */
app.use((req, res, next) => {
  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = (elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6).toFixed(3);
    console.log(`${req.path} : ${elapsedTimeInMs}ms`);
  });

  next();
});


/* This code snippet is defining a POST route in the Express application at the endpoint '/data'. When
a POST request is made to this endpoint, the callback function defined with `async (req, res)` is
executed. Here's a breakdown of what the code inside this route handler is doing: */
app.post('/data', async (req, res) => {
  const { content } = req.body;
  const newDataEntry = new DataEntry({ content, addCount: 1 });
  await newDataEntry.save();
  res.status(201).send(newDataEntry);
});



/* This code snippet defines a PUT route in the Express application at the endpoint '/data/:id'. When a
PUT request is made to this endpoint with a specific ID parameter, the callback function defined
with `async (req, res)` is executed. Here's a breakdown of what the code inside this route handler
is doing: */
app.put('/data/:id', async (req, res) => {
  const { content } = req.body;
  const dataEntry = await DataEntry.findByIdAndUpdate(req.params.id, { content, $inc: { updateCount: 1 } }, { new: true });
  res.send(dataEntry);
});


/* This code snippet defines a GET route in the Express application at the endpoint '/data/count'. When
a GET request is made to this endpoint, the callback function defined with `async (req, res)` is
executed. Here's a breakdown of what the code inside this route handler is doing: */
app.get('/data/count', async (req, res) => {
  const entries = await DataEntry.aggregate([
    {
      $group: {
        _id: null,
        totalAdds: { $sum: "$addCount" },
        totalUpdates: { $sum: "$updateCount" }
      }
    }
  ]);
  res.send(entries);
});

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
