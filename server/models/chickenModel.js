// chickenModel.js
const mongoose = require('mongoose');

const chickenSchema = new mongoose.Schema({
  createId: { type: String, required: true },
  fullName: { type: String, required: true },
  variety: { type: String, required: true },
  chickenType: { type: String, required: true },
  purpose: { type: String, required: true },
  dateOfAcquired: { type: Date, required: true },
  feed: { type: String, required: true },
});

module.exports = mongoose.model('Chicken', chickenSchema);
