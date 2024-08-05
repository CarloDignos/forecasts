const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChickenTypeSchema = new Schema({
  Native_Improved_Chicken: Number,
  Layer_Chicken: Number,
  Broiler_Chicken: Number
});

const DataSchema = new Schema({
  Year: Number,
  Quarter: String,
  Chicken_Type: ChickenTypeSchema
});

const ForecastSchema = new Schema({
  Region: String,
  Province: String,
  Data: [DataSchema]
});

module.exports = mongoose.model('Forecast', ForecastSchema);
