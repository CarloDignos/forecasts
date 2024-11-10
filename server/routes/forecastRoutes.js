const express = require('express');
const router = express.Router();
const chickenData = require('../data/tarlac_chicken_data_with_percentages.json');

router.get('/getForecast', (req, res) => {
  const { selectedChicken, year, totalPerBatch } = req.query;

  if (!selectedChicken || !year || !totalPerBatch) {
    return res.status(400).json({ error: 'Please provide selectedChicken, year, and totalPerBatch.' });
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

      let percentagePerChickentType;
      switch (selectedChicken) {
        case 'Native':
          percentagePerChickentType = 22;
          break;
        case 'Layer':
          percentagePerChickentType = 24;
          break;
        case 'Broiler':
          percentagePerChickentType = 23;
          break;
        default:
          percentagePerChickentType = 1; // Default percentage in case the chicken type doesn't match
      }

    const forecastValue = Math.round((percentagePerChickentType / percentage) * totalPerBatch);

    return {
      Year: item.Year,
      Quarter: item.Quarter,
      Chicken_Type: {
        [selectedChicken]: item.Chicken_Type[selectedChicken]
      },
      Forecast: forecastValue
    };
  });

  res.json(filteredData);
});

module.exports = router;
