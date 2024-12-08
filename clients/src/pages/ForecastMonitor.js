import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Container, FormControl, InputLabel, Select, MenuItem, Typography, Box, Button } from "@mui/material";
import ReactEcharts from "echarts-for-react"; // Import the E-Charts library
import { CSVLink } from "react-csv"; // Import the CSVLink component
import DownloadIcon from "@mui/icons-material/Download"; // Import the Download icon

const EggProductionForecast = () => {
  const user = useSelector((state) => state.user);
  const [varieties, setVarieties] = useState([]);
  const [breeding, setBreeding] = useState([]);
  const [selectedChicken, setSelectedChicken] = useState("");
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [forecastData, setForecastData] = useState([]);

  const percentageByChicken = {
    Native: 0.1,
    Layer: 0.1,
    Broiler: 0.1,
  };

  useEffect(() => {
    // Fetch varieties and chicken types from your Express.js API
    axios
      .get("http://localhost:5001/variety/varietiesGetAll")
      .then((response) => {
        setVarieties(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Fetch breeding information from your Express.js API
    axios
      .get(`http://localhost:5001/breeding/breedingGetAll?userId=${user._id}`)
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
      .filter((chicken) => chicken.selectedChicken === selectedChicken)
      .map((chicken) => chicken.batch);

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
    if (!selectedChicken || !selectedBatch || !selectedYear) {
      console.error("Please select all options before fetching forecast data.");
      return;
    }

    const selectedBatchInfo = breeding.find(
      (breed) => breed.batch === selectedBatch && breed.selectedChicken === selectedChicken
    );
    if (selectedBatchInfo) {
      const totalPerBatch = selectedBatchInfo.totalPerBatch;

      axios
        .get(
          `http://localhost:5001/forecast/getForecast?selectedChicken=${selectedChicken}&year=${selectedYear}&totalPerBatch=${totalPerBatch}`
        )
        .then((response) => {
          let forecastData = response.data;

          // Calculate Upper and Lower Bounds based on chicken type
          const percentageTotal = percentageByChicken[selectedChicken] || 0.1;

          forecastData = forecastData.map((item) => {
            const upperBound = item.Forecast * (1 + percentageTotal);
            const lowerBound = item.Forecast * (1 - percentageTotal);

            return {
              ...item,
              UpperBound: upperBound,
              LowerBound: lowerBound,
            };
          });

          setForecastData(forecastData);
        })
        .catch((error) => {
          console.error(error);
          alert("Failed to fetch forecast data. Please try again later.");
        });
    }
  };

  const getEChartsOptions = () => {
    if (forecastData.length) {
      const quarterlyData = forecastData.map((item) => ({
        quarter: item.Quarter,
        forecast: item.Forecast,
        upperBound: item.UpperBound,
        lowerBound: item.LowerBound,
      }));
  
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: ["Forecast", "Upper Bound", "Lower Bound"],
          bottom: 0,
        },
        xAxis: {
          type: "category",
          data: quarterlyData.map((item) => item.quarter),
        },
        yAxis: {
          type: "value",
          name: "Forecasted Value",
        },
        series: [
          {
            name: "Forecast",
            data: quarterlyData.map((item) => item.forecast),
            type: "line",
            smooth: true,
            label: {
              show: true,
              position: "top",
              formatter: "{c}",
            },
          },
          {
            name: "Upper Bound",
            data: quarterlyData.map((item) => item.upperBound || null),
            type: "line",
            lineStyle: {
              type: "dashed",
            },
          },
          {
            name: "Lower Bound",
            data: quarterlyData.map((item) => item.lowerBound || null),
            type: "line",
            lineStyle: {
              type: "dashed",
            },
          },
        ],
      };
    }
    return {};
  };
  

  const currentYear = 2031;
  const years = Array.from({ length: 8 }, (_, i) => currentYear - i);

  const uniqueBreeding = Array.from(new Set(breeding.map((chicken) => chicken.selectedChicken)));

  const csvData = forecastData.map((item) => ({
    Year: selectedYear,
    ChickenType: selectedChicken,
    Quarter: item.Quarter,
    Forecast: item.Forecast,
    UpperBound: item.UpperBound,
    LowerBound: item.LowerBound,
  }));

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Egg Production Forecast
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Select Chicken Breeding</InputLabel>
          <Select value={selectedChicken} onChange={handleChickenChange} label="Select Chicken Breeding">
            <MenuItem value="">
              <em>Select an option</em>
            </MenuItem>
            {uniqueBreeding.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedChicken && (
          <>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Select Batch</InputLabel>
              <Select value={selectedBatch} onChange={handleBatchChange} label="Select Batch">
                <MenuItem value="">
                  <em>Select a batch</em>
                </MenuItem>
                {filteredBatches.map((batch, index) => (
                  <MenuItem key={index} value={batch}>
                    {batch}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel>Select Year</InputLabel>
              <Select value={selectedYear} onChange={handleYearChange} label="Select Year">
                <MenuItem value="">
                  <em>Select a year</em>
                </MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
      </Box>

      {selectedBatch && forecastData.length > 0 && (
        <Box mt={4}>
          <ReactEcharts option={getEChartsOptions()} style={{ height: "400px" }} />
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              style={{ textDecoration: "none", color: "white", backgroundColor: "#3f51b5" }}
            >
              <CSVLink
                data={csvData}
                filename={`forecast_${selectedChicken}_${selectedBatch}_${selectedYear}.csv`}
                style={{ textDecoration: "none", color: "white" }}
              >
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
