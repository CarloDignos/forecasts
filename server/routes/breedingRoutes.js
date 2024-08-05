// breedingRoutes.js
const express = require('express');
const router = express.Router();
const BreedingModel = require('../models/breedingModel');

// Create a new breeding record
// Create a new breeding record
router.post('/breedingRegister', async (req, res) => {
  try {
    const { createdId, fullName, selectedChicken, batch, chickenPerBatch, date } = req.body;

    // Check if there is an existing record with the same selectedChicken and batch
    const existingRecord = await BreedingModel.findOne({ createdId, selectedChicken, batch });

    if (existingRecord) {
      // If there is an existing record, check if the batch is different
      if (existingRecord.batch === batch) {
        return res.status(400).json({ error: 'Duplicate record. Same batch already exists.' });
      }
      // If the batch is different, proceed to save the new record
    }

    // Calculate totalPerBatch based on selectedChicken type
    let multiplier;
    switch (selectedChicken) {
      case 'Native':
        multiplier = 250;
        break;
      case 'Broiler':
        multiplier = 180;
        break;
      case 'Layer':
        multiplier = 150;
        break;
      default:
        multiplier = 1; // Default multiplier in case the chicken type doesn't match
    }
    const totalPerBatch = chickenPerBatch * multiplier;

    const breedingRecord = new BreedingModel({
      createdId,
      fullName,
      selectedChicken,
      batch,
      chickenPerBatch,
      totalPerBatch,
      date
    });

    await breedingRecord.save();
    res.status(201).json(breedingRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Retrieve breeding records for a specific user
router.get('/breedingGetAll', async (req, res) => {
  try {
    const { userId } = req.query;
    const breedingRecords = await BreedingModel.find({ createdId: userId });
    res.status(200).json(breedingRecords);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
exports.getAllBreeding = (req, res) => {

};
// Update a breeding record by ID
router.put('/breedingUpdate/:id', async (req, res) => {
  try {
    const { createdId, fullName, selectedChicken, batch, chickenPerBatch, date } = req.body;
    const breedingRecord = await BreedingModel.findByIdAndUpdate(req.params.id, { createdId, fullName, selectedChicken, batch, chickenPerBatch, date }, { new: true });
    res.status(200).json(breedingRecord);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a breeding record by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    await BreedingModel.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
