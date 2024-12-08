//forecastRoutes.js
const express = require('express');
const router = express.Router();
const chickenData = require('../data/tarlac_chicken_data_with_percentages.json');

// Define the egg production percentage table for different chicken types
const chickenTypePercentages = {
  Native: [100, 80, 70, 60, 50, 40, 30],
  Layer: [100, 80, 70, 60, 50, 40, 30],
  Broiler: [100, 80, 70, 60, 50, 40, 30],
};

// Map the base year for the first year of production (e.g., 2025 = 1 year old)
const baseYear = 2025;

router.get('/getForecast', (req, res) => {
  const { selectedChicken, year, totalPerBatch } = req.query;

  if (!selectedChicken || !year || !totalPerBatch) {
    return res.status(400).json({ error: 'Please provide selectedChicken, year, and totalPerBatch.' });
  }

  // Calculate the age of the chicken based on the year
  const chickenAge = year - baseYear + 1;

  // Ensure chicken age is within valid range
  if (chickenAge < 1 || chickenAge > 7) {
    return res.status(400).json({ error: 'Year out of range. Only years corresponding to chicken ages 1 to 7 are supported.' });
  }

  // Get the percentage for the chicken type and age
  const percentagePerChickentType = chickenTypePercentages[selectedChicken]?.[chickenAge - 1];
  if (!percentagePerChickentType) {
    return res.status(400).json({ error: 'Invalid chicken type or no percentage data available for this type.' });
  }

  const forecastData = chickenData.Data.filter(item => item.Year == year && item.Chicken_Type[selectedChicken] !== undefined);

  if (!forecastData.length) {
    return res.status(404).json({ error: 'No data found for the provided year and chicken type.' });
  }

  const filteredData = forecastData.map(item => {
    let percentage;
    switch (selectedChicken) {
      case 'Native':
        percentage = item.Native_Percent;
        break;
      case 'Layer':
        percentage = item.Layer_Percent;
        break;
      case 'Broiler':
        percentage = item.Broiler_Percent;
        break;
      default:
        percentage = 1; // Default percentage in case the chicken type doesn't match
    }

    // Adjust forecast value based on the chicken type and its age
    const forecastValue = Math.round((percentage / 100) * (percentagePerChickentType / 100) * totalPerBatch);

    return {
      Year: item.Year,
      Quarter: item.Quarter,
      Chicken_Type: {
        [selectedChicken]: item.Chicken_Type[selectedChicken]
      },
      Forecast: forecastValue,
      PercentagePerChickentType: percentagePerChickentType,
    };
  });

  res.json(filteredData);
});

module.exports = router;