const express = require('express');
const router = express.Router();
const Health = require('../models/healthModel');

// Endpoint to save health data
router.post('/add', async (req, res) => {
  try {
    const { userId, chickenType, batch, treatmentType, treatmentValue, selectedDate } = req.body;

    const healthData = new Health({
      userId,
      chickenType,
      batch,
      treatmentType,
      treatmentValue,
      selectedDate,
    });

    const savedHealthData = await healthData.save();
    res.json(savedHealthData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get health data for a specific user
router.get('/get/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const healthData = await Health.find({ userId });
    res.json(healthData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
