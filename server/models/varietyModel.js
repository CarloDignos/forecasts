const mongoose = require('mongoose');

const varietySchema = new mongoose.Schema({
  variety: {
    type: String,
    required: true,

  },
  chickenType: {
    type: String,
    required: true,
    unique: true, // Add the unique constraint
  },
  description: {
    type: String,
    required: true,
  },
  eggProduction: {
    type: String,
    required: true,
  },
  timeSeries: {
    quarterlyPercentages: [Number],
    isApplicable: { type: Boolean, default: true }
  },
  picture: {
    type: String,
  },
});

const Variety = mongoose.model('Variety', varietySchema);

module.exports = Variety;
