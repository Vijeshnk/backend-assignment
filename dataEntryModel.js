const mongoose = require('mongoose');

const dataEntrySchema = new mongoose.Schema({
  content: String,
  addCount: { type: Number, default: 0 },
  updateCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('DataEntry', dataEntrySchema);
