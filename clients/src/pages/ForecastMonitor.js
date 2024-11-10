import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Container, FormControl, InputLabel, Select, MenuItem, Typography, Box, Button } from '@mui/material';
import ReactEcharts from 'echarts-for-react'; // Import the E-Charts library
import { CSVLink } from 'react-csv'; // Import the CSVLink component
import DownloadIcon from '@mui/icons-material/Download'; // Import the Download icon

const EggProductionForecast = () => {
  const user = useSelector((state) => state.user);
  const [varieties, setVarieties] = useState([]);
  const [breeding, setBreeding] = useState([]);
  const [selectedChicken, setSelectedChicken] = useState("");
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    // Fetch varieties and chicken types from your Express.js API
    axios.get('http://localhost:5001/variety/varietiesGetAll')
      .then((response) => {
        setVarieties(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Fetch breeding information from your Express.js API
    axios.get(`http://localhost:5001/breeding/breedingGetAll?userId=${user._id}`)
      .then((response) => {
        setBreeding(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user._id]);

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    fetchForecastData(selectedChicken, selectedBatch, year);
  };

  const handleChickenChange = (event) => {
    const selectedChicken = event.target.value;
    setSelectedChicken(selectedChicken);

    const batchesForChicken = breeding
      .filter(chicken => chicken.selectedChicken === selectedChicken)
      .map(chicken => chicken.batch);

    setFilteredBatches(batchesForChicken);
    setSelectedBatch("");
    setForecastData([]);
  };

  const handleBatchChange = (event) => {
    const selectedBatch = event.target.value;
    setSelectedBatch(selectedBatch);
    fetchForecastData(selectedChicken, selectedBatch, selectedYear);
  };

  const fetchForecastData = (selectedChicken, selectedBatch, selectedYear) => {
    if (selectedChicken && selectedBatch && selectedYear) {
      const selectedBatchInfo = breeding.find(breed => breed.batch === selectedBatch && breed.selectedChicken === selectedChicken);
      if (selectedBatchInfo) {
        const totalPerBatch = selectedBatchInfo.totalPerBatch;
        axios.get(`http://localhost:5001/forecast/getForecast?selectedChicken=${selectedChicken}&year=${selectedYear}&totalPerBatch=${totalPerBatch}`)
          .then((response) => {
            setForecastData(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  const getEChartsOptions = () => {
    if (forecastData.length) {
      const quarterlyData = forecastData.map(item => ({
        quarter: item.Quarter,
        forecast: item.Forecast
      }));

      return {
        xAxis: {
          type: 'category',
          data: quarterlyData.map(item => item.quarter),
        },
        yAxis: {
          type: 'value',
          name: 'Forecasted Value',
        },
        series: [{
          data: quarterlyData.map(item => item.forecast),
          type: 'line',
          //areaStyle: {}, // This line enables the area chart
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
          },
        }],
      };
    }
    return {};
  };

  const uniqueBreeding = Array.from(new Set(breeding.map(chicken => chicken.selectedChicken)));

  // Include the selected year and chicken type in the CSV data
  const csvData = forecastData.map(item => ({
    Year: selectedYear,
    ChickenType: selectedChicken,
    Quarter: item.Quarter,
    Forecast: item.Forecast
  }));

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Egg Production Forecast</Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Select Chicken Breeding</InputLabel>
          <Select
            value={selectedChicken}
            onChange={handleChickenChange}
            label="Select Chicken Breeding"
          >
            <MenuItem value="">
              <em>Select an option</em>
            </MenuItem>
            {uniqueBreeding.map((option, index) => (
              <MenuItem key={index} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedChicken && (
          <>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Select Batch</InputLabel>
              <Select
                value={selectedBatch}
                onChange={handleBatchChange}
                label="Select Batch"
              >
                <MenuItem value="">
                  <em>Select a batch</em>
                </MenuItem>
                {filteredBatches.map((batch, index) => (
                  <MenuItem key={index} value={batch}>{batch}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel>Select Year</InputLabel>
              <Select
                value={selectedYear}
                onChange={handleYearChange}
                label="Select Year"
              >
                <MenuItem value="">
                  <em>Select a year</em>
                </MenuItem>
                {[2019, 2020, 2021, 2022, 2023].map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
      </Box>

      {selectedBatch && forecastData.length > 0 && (
        <Box mt={4}>
          <ReactEcharts option={getEChartsOptions()} style={{ height: '400px' }} />
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              style={{
                textDecoration: 'none',
                color: 'white',
                backgroundColor: '#3f51b5',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#303f9f')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3f51b5')}
            >
              <CSVLink data={csvData} filename={`forecast_${selectedChicken}_${selectedBatch}_${selectedYear}.csv`} style={{ textDecoration: 'none', color: 'white' }}>
                Export as CSV
              </CSVLink>
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default EggProductionForecast;
