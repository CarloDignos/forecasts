import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { useSelector } from 'react-redux';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
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
import axios from 'axios';
// Register all Chart.js components
ChartJS.register(...registerables);

const EggForecastGraph = () => {
  const [actualData, setActualData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [seasonalData, setSeasonalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chickenTypes, setChickenTypes] = useState([]);
  const [selectedChickenType, setSelectedChickenType] = useState('');
  const [forecastYear, setForecastYear] = useState('');
  const user = useSelector((state) => state.user);

  const graphRef = useRef();

  useEffect(() => {
    const fetchChickenTypes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/breeding/breedingGetAll?userId=${user._id}`,
        );
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
        `http://localhost:5001/eggCollection/arimaForecast?userId=${user._id}&chickenTypeId=${selectedChickenType}&forecastYear=${forecastYear}`,
      );

      const { actual, forecast } = response.data;

      if (!actual || !forecast) {
        throw new Error('Incomplete data received from the API');
      }

      const labels = [...actual.map((item) => item.date), ...forecast.dates];
      const actualValues = actual.map((item) => item.collectedEgg);
      const forecastValues = new Array(actualValues.length)
        .fill(null)
        .concat(forecast.values);

      const seasonalValues = new Array(labels.length).fill(null);
      seasonalValues.splice(
        actualValues.length,
        forecast.seasonal.length,
        ...forecast.seasonal,
      );

      const trendValues = new Array(labels.length).fill(null);
      trendValues.splice(0, forecast.trend.length, ...forecast.trend);

      setActualData({
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
        ],
      });

      setForecastData({
        labels,
        datasets: [
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

      setSeasonalData({
        labels,
        datasets: [
          {
            label: 'Seasonal',
            data: seasonalValues,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
            tension: 0.4,
          },
        ],
      });

      setTrendData({
        labels,
        datasets: [
          {
            label: 'Trend',
            data: trendValues,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            fill: true,
            tension: 0.4,
          },
        ],
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching forecast:', err);
      setError('Failed to fetch data.');
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF('portrait', 'mm', 'a4'); // A4 size
    const canvasOptions = { scale: 2, useCORS: true }; // Ensure high-quality rendering
    let startY = 10; // Initial Y position

    // Function to add a specific chart to the PDF
    const addChartToPDF = async (chartId, title) => {
      const chartElement = document
        .getElementById(chartId)
        ?.querySelector('canvas');
      if (chartElement) {
        const canvas = await html2canvas(chartElement, canvasOptions);
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190; // Width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

        if (startY + imgHeight > 280) {
          pdf.addPage(); // Add new page if the chart doesn’t fit
          startY = 10; // Reset Y position
        }

        // Add chart title
        pdf.setFontSize(14);
        pdf.text(title, 10, startY);
        startY += 8; // Space below title

        // Add the chart image
        pdf.addImage(imgData, 'PNG', 10, startY, imgWidth, imgHeight);
        startY += imgHeight + 10; // Update Y position for the next chart
      }
    };

    // Add all charts
    if (actualData)
      await addChartToPDF('actual-chart', 'Actual Collected Eggs');
    if (forecastData) await addChartToPDF('forecast-chart', 'Forecasted Data');
    if (seasonalData) await addChartToPDF('seasonal-chart', 'Seasonal Data');
    if (trendData) await addChartToPDF('trend-chart', 'Trend Data');

    // Add the data table on a new page
    pdf.addPage(); // Start a new page for the table
    const tableData = [];
    const labels = actualData?.labels || [];
    const actualValues = actualData?.datasets[0]?.data || [];
    const forecastValues = forecastData?.datasets[0]?.data || [];
    const seasonalValues = seasonalData?.datasets[0]?.data || [];
    const trendValues = trendData?.datasets[0]?.data || [];

    labels.forEach((label, index) => {
      tableData.push([
        label || '-', // Date
        actualValues[index] !== null && !isNaN(actualValues[index])
          ? actualValues[index].toFixed(2)
          : '-', // Actual Eggs (2 decimal places)
        forecastValues[index] !== null && !isNaN(forecastValues[index])
          ? forecastValues[index].toFixed(2)
          : '-', // Forecasted Eggs (2 decimal places)
        seasonalValues[index] !== null && !isNaN(seasonalValues[index])
          ? seasonalValues[index].toFixed(2)
          : '-', // Seasonal (2 decimal places)
        trendValues[index] !== null && !isNaN(trendValues[index])
          ? trendValues[index].toFixed(2)
          : '-', // Trend (2 decimal places)
      ]);
    });

    const headers = [
      ['Date', 'Actual Eggs', 'Forecasted Eggs', 'Seasonal', 'Trend'],
    ];
    pdf.autoTable({
      head: headers,
      body: tableData,
      startY: 10, // Start at the top of the new page
      styles: { fontSize: 10, cellPadding: 2 },
      theme: 'grid',
    });

    pdf.save('Egg_Forecast_Report.pdf');
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
                  setError(null);
                }}
                fullWidth
                required>
                <MenuItem value="" disabled>
                  Select a chicken type
                </MenuItem>
                {Array.isArray(chickenTypes) &&
                  chickenTypes.map((type) => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.selectedChicken}
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
                disabled={loading}>
                {loading ? 'Loading...' : 'See Graphs'}
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

      <Box ref={graphRef}>
        {actualData && (
          <div id="actual-chart">
            <Card variant="outlined" sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6">Actual Collected Eggs</Typography>
                <Line data={actualData} />
              </CardContent>
            </Card>
          </div>
        )}

        {forecastData && (
          <div id="forecast-chart">
            <Card variant="outlined" sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6">Forecasted Data</Typography>
                <Line data={forecastData} />
              </CardContent>
            </Card>
          </div>
        )}

        {seasonalData && (
          <div id="seasonal-chart">
            <Card variant="outlined" sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6">Seasonal</Typography>
                <Line data={seasonalData} />
              </CardContent>
            </Card>
          </div>
        )}

        {trendData && (
          <div id="trend-chart">
            <Card variant="outlined" sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6">Trend</Typography>
                <Line data={trendData} />
              </CardContent>
            </Card>
          </div>
        )}
      </Box>

      {actualData && (
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 3 }}
          onClick={handleDownloadPDF}>
          Download Report as PDF
        </Button>
      )}
    </Container>
  );
};

export default EggForecastGraph;
