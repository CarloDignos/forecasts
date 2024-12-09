const mongoose = require('mongoose');

const eggCollectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chickenTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Breeding', required: true },
  batch: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date },
  date: { type: Date, required: true },
  goodEgg: { type: Number, required: true },
  spoiltEgg: { type: Number, required: true },
  collectedEgg: { type: Number, required: true },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('EggCollection', eggCollectionSchema);
