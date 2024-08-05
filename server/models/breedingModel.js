// breedingModel.js
const mongoose = require('mongoose');

const BreedingSchema = new mongoose.Schema({
  createdId: {
    type: String,
    require: true,
  },
  fullName: {
    type: String,
    require: true,
  },
  selectedChicken: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  chickenPerBatch: {
    type: String,
    required: true,
  },
  totalPerBatch: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const BreedingModel = mongoose.model('Breeding', BreedingSchema);

module.exports = BreedingModel;
