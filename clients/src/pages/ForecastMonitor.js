import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EggForecastGraph = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chickenTypes, setChickenTypes] = useState([]);
  const [selectedChickenType, setSelectedChickenType] = useState('');
  const [forecastYear, setForecastYear] = useState('');
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchChickenTypes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/breeding/breedingGetAll?userId=${user._id}`
        );
        console.log('Fetched chicken types:', response.data); // Debug log
        setChickenTypes(response.data);
      } catch (err) {
        console.error('Failed to fetch chicken types:', err);
      }
    };
  
    fetchChickenTypes();
  }, [user._id]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:5001/eggCollection/arimaForecast?userId=${user._id}&chickenTypeId=${selectedChickenType}&forecastYear=${forecastYear}`
      );

      const { actual, forecast } = response.data;

      const labels = [...actual.map((item) => item.date), ...forecast.dates];
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
            label: 'Forecasted',
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

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Egg Collection and Forecast
      </Typography>

      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="Chicken Type"
              value={selectedChickenType}
              onChange={(e) => {
                setSelectedChickenType(e.target.value);
                setError(null); // Clear any previous errors
              }}
              fullWidth
              required
            >
              <MenuItem value="" disabled>
                Select a chicken type
              </MenuItem>
              {Array.isArray(chickenTypes) &&
                chickenTypes.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.selectedChicken} {/* Display chicken type */}
                  </MenuItem>
                ))}
            </TextField>


              <TextField
                type="number"
                label="Forecast Year"
                value={forecastYear}
                onChange={(e) => setForecastYear(e.target.value)}
                placeholder="Enter forecast year"
                fullWidth
                required
              />

              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'See Graph'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
      {chartData && (
        <Card variant="outlined" sx={{ mt: 3 }}>
          <CardContent>
            <Line data={chartData} />
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default EggForecastGraph;
