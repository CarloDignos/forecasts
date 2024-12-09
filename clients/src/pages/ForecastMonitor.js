import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EggForecastGraph = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/eggCollection/arimaForecast?userId=66b0ec325eb6e44ac345f0a3&chickenTypeId=6756101ce4dc2baafcf7192b&forecastYear=2023', {
          params: {
          },
        });

        const { actual, forecast } = response.data;

        // Prepare the data for the chart
        const labels = [
          ...actual.map((item) => item.date),
          ...forecast.dates,
        ];

        const actualValues = actual.map((item) => item.collectedEgg);
        const forecastValues = new Array(actualValues.length).fill(null).concat(forecast.values);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Actual Collected Eggs',
              data: actualValues,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Forecasted Collected Eggs',
              data: forecastValues,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true,
              tension: 0.4,
            },
          ],
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <h2>Egg Collection and Forecast</h2>
      {chartData && <Line data={chartData} />}
    </div>
  );
};

export default EggForecastGraph;
