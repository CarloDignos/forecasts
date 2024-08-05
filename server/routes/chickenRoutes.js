// chickenRoutes.js
const express = require('express');
const router = express.Router();
const Chicken = require('../models/chickenModel');

// Route to create a new chicken
router.post('/chickensRegister', async (req, res) => {
  try {
    const chicken = new Chicken(req.body);
    const savedChicken = await chicken.save();
    res.json(savedChicken);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to get a list of chickens based on createId
router.get('/chickensList', async (req, res) => {
  try {
    const { createId } = req.query;
    const query = createId ? { createId } : {};
    const chickens = await Chicken.find(query);
    res.json(chickens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
