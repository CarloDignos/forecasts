const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const eggCollectionController = require('../controllers/eggCollectionController');
const EggCollection = require('../models/eggCollectionModel');
// Create an egg collection
router.post('/create', eggCollectionController.createEggCollection);

// Get all egg collections for a user
router.get('/', eggCollectionController.getEggCollections);

// Update an egg collection by ID
router.put('/update/:id', eggCollectionController.updateEggCollection);

// Delete an egg collection by ID
router.delete('/delete/:id', eggCollectionController.deleteEggCollection);

// Route to generate ARIMA forecast
// Route to generate ARIMA forecast
router.get('/arimaForecast', async (req, res) => {
    try {
        const { userId, chickenTypeId, forecastYear } = req.query;

        if (!userId || !chickenTypeId || !forecastYear) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Fetch actual egg collection data for the user and chicken type
        const actualData = await EggCollection.find({
            userId,
            chickenTypeId,
            date: { $lte: new Date(`${forecastYear}-12-31`) },
        }).sort({ date: 1 });

        if (!actualData.length) {
            return res.status(404).json({ error: 'No data found for the given user and chicken type' });
        }

        // Prepare data to send to the Python script
        const eggData = actualData.map(record => ({
            date: record.date,
            collectedEgg: record.collectedEgg,
        }));

        // Group the data by quarter in Node.js before sending to Python
        const quarterlyData = [];
        let currentQuarter = null;
        let quarterSum = 0;

        eggData.forEach(record => {
            const date = new Date(record.date);
            const quarter = Math.floor(date.getMonth() / 3) + 1;
            const year = date.getFullYear();
            const quarterKey = `${year}-Q${quarter}`;

            if (currentQuarter !== quarterKey) {
                if (currentQuarter) {
                    quarterlyData.push({ date: currentQuarter, collectedEgg: quarterSum });
                }
                currentQuarter = quarterKey;
                quarterSum = 0;
            }
            quarterSum += record.collectedEgg;
        });

        // Push the last quarter
        if (currentQuarter) {
            quarterlyData.push({ date: currentQuarter, collectedEgg: quarterSum });
        }

        // Define forecast steps based on the forecastYear
        const forecastSteps = (forecastYear - new Date().getFullYear() + 1) * 4; // 4 quarters per year

        // Spawn the Python process
        const pythonProcess = spawn('C:\\Python312\\python', ['forecast_arima.py']);

        // Send quarterly data and forecast steps to Python script
        pythonProcess.stdin.write(JSON.stringify({ data: quarterlyData, steps: forecastSteps }));
        pythonProcess.stdin.end();

        let result = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    const forecastResult = JSON.parse(result);
                    if (forecastResult.error) {
                        console.error("Forecast Error:", forecastResult.error);
                        return res.status(500).json({ error: forecastResult.error });
                    }

                    const response = {
                        actual: quarterlyData,
                        forecast: forecastResult,
                    };
                    res.status(200).json(response);
                } catch (error) {
                    console.error("JSON Parse Error:", error);
                    res.status(500).json({ error: "Failed to parse forecast data" });
                }
            } else {
                res.status(500).json({ error: "Forecast generation failed" });
            }
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python error: ${data.toString()}`);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




  router.post('/bulkCreate', async (req, res) => {
    const { userId, data } = req.body;

    if (!userId || !data || !Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    try {
        const collections = data.map((item, index) => {
            let parsedDate = null;

            if (item.date) {
                if (typeof item.date === 'number') {
                    // Detect whether the number is in seconds or milliseconds
                    parsedDate = item.date > 1000000000000
                        ? new Date(item.date) // Milliseconds
                        : new Date(item.date * 1000); // Seconds
                } else if (typeof item.date === 'string') {
                    parsedDate = new Date(item.date);
                }

                if (isNaN(parsedDate.getTime())) {
                    console.warn(`Row ${index + 1}: Invalid date "${item.date}"`);
                    parsedDate = null; // Set to null for invalid dates
                }
            }

            if (!parsedDate) {
                console.warn(`Row ${index + 1}: Missing or invalid date, setting default.`);
                parsedDate = new Date(); // Default to current date
            }

            return {
                userId,
                chickenTypeId: item.chickenTypeId || '',
                batch: item.batch || '',
                date: parsedDate,
                goodEgg: parseInt(item.goodEgg, 10) || 0,
                spoiltEgg: parseInt(item.spoiltEgg, 10) || 0,
                collectedEgg: parseInt(item.collectedEgg, 10) || 0,
                notes: item.notes || '',
            };
        });

        const createdCollections = await EggCollection.insertMany(collections);
        res.status(201).json(createdCollections);
    } catch (error) {
        console.error('Bulk creation error:', error);
        res.status(500).json({ error: 'Bulk creation failed', details: error.message });
    }
});


module.exports = router;
