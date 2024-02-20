require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const DataEntry = require('./dataEntryModel');
require('./db'); 
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors()); 
// API to add data
app.post('/data', async (req, res) => {
  const { content } = req.body;
  const newDataEntry = new DataEntry({ content, addCount: 1 }); 
  await newDataEntry.save();
  res.status(201).send(newDataEntry);
});


// API to update data
app.put('/data/:id', async (req, res) => {
  const { content } = req.body;
  const dataEntry = await DataEntry.findByIdAndUpdate(req.params.id, { content, $inc: { updateCount: 1 } }, { new: true });
  res.send(dataEntry);
});

// API to count add and update operations
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
