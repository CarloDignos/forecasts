const express = require('express');
const router = express.Router();
const Variety = require('../models/varietyModel');

function validateQuarterlyPercentages(quarterlyPercentages) {
  if (!Array.isArray(quarterlyPercentages) || quarterlyPercentages.length > 4) {
    throw new Error('Invalid number of quarterly percentages data');
  }

  const sum = quarterlyPercentages.reduce((acc, percentage) => acc + percentage, 0);
  if (sum > 100) {
    throw new Error('Quarterly percentages must not exceed 100%');
  }
}

// Create a new variety
// Create a new variety
router.post('/varieties', async (req, res) => {
  try {
    const varietyData = req.body;
    console.log('Received data:', varietyData); // Add this line for additional logging

    const { quarterlyPercentages, isApplicable } = varietyData.timeSeries;

    if (isApplicable) {
      // Log the quarterly percentages for debugging
      console.log('Quarterly Percentages:', quarterlyPercentages);

      // Validate quarterly percentages (assuming validateQuarterlyPercentages is a function)
      validateQuarterlyPercentages(quarterlyPercentages);
    } else {
      varietyData.timeSeries.quarterlyPercentages = [];
    }

    // Log the variety data before saving
    console.log('Saving variety data:', varietyData);

    const variety = new Variety(varietyData);
    const savedVariety = await variety.save();
    res.json(savedVariety);
  } catch (error) {
    console.error('Error:', error.message); // Log the error for debugging
    res.status(422).json({ error: error.message });
  }
});


// Update a variety by ID
router.put('/varietiesUpdate/:id', async (req, res) => {
  try {
    console.log("Request Params:", req.params);
    console.log("Request Body:", req.body);

    const updatedVariety = await Variety.findByIdAndUpdate(
      req.params.id, 
      req.body,  // Assuming req.body has the correct structure
      { new: true }
    );

    if (!updatedVariety) {
      return res.status(404).send("Variety not found");
    }

    res.send(updatedVariety);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).send("Error updating variety");
  }
});


// Get all varieties
router.get('/varietiesGetAll', async (req, res) => {
  try {
    const varieties = await Variety.find();
    res.json(varieties);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a variety by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedVariety = await Variety.findByIdAndRemove(req.params.id);

    if (!deletedVariety) {
      return res.status(404).json({ error: 'Variety not found' });
    }

    res.json({ message: 'Variety deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
