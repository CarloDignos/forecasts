const EggCollection = require('../models/eggCollectionModel');

// Create an egg collection
exports.createEggCollection = async (req, res) => {
  try {
    const { userId, batch, chickenTypeId, date, goodEgg, spoiltEgg, collectedEgg, notes } = req.body;
    const newEggCollection = new EggCollection({ userId, batch, chickenTypeId, date, goodEgg, spoiltEgg, collectedEgg, notes });
    const savedCollection = await newEggCollection.save();
    res.status(201).json(savedCollection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all egg collections for a specific user
exports.getEggCollections = async (req, res) => {
  try {
    const { userId } = req.query;
    const collections = await EggCollection.find({ userId }).populate('chickenTypeId');
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an egg collection
exports.updateEggCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedCollection = await EggCollection.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json(updatedCollection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an egg collection
exports.deleteEggCollection = async (req, res) => {
  try {
    const { id } = req.params;
    await EggCollection.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
