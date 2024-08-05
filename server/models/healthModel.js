const mongoose = require('mongoose');

const healthSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  chickenType: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  treatmentType: {
    type: String,
    required: true,
  },
  treatmentValue: {
    type: String,
    required: true,
  },
  selectedDate: {
    type: Date,
    required: true,
  },
});

const Health = mongoose.model('Health', healthSchema);

module.exports = Health;
