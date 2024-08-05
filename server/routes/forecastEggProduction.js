// forecastEggProduction.js
const { Prophet } = require('prophet');

function forecastEggProduction(eggProduction) {
  // Sample data for time series
  const data = eggProduction.map((value, index) => ({
    ds: new Date().setMonth(index * 3), // Assuming data is quarterly
    y: value,
  }));

  const model = new Prophet();
  model.fit(data);
  
  // Create future data points for forecasting
  const future = model.make_future_dataframe({
    periods: 4, // Predict the next 4 quarters
  });

  const forecast = model.predict(future);
  
  // Extract the forecasted values for each quarter
  const forecasts = forecast.tail(4).yhat.arraySync();

  return forecasts;
}

module.exports = forecastEggProduction;
