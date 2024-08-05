const chickenData = require('../data/tarlac_chicken_data.json');

exports.getAllVarieties = (req, res) => {
  const varieties = chickenData.Data.map(entry => ({
    year: entry.Year,
    quarter: entry.Quarter,
    chickenType: entry.Chicken_Type,
  }));
  res.json(varieties);
};
