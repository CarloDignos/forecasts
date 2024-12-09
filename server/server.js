const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const chickenRoutes = require('./routes/chickenRoutes');
const varietyRoutes = require('./routes/varietyRoutes');
const breedingRoutes = require('./routes/breedingRoutes');
const healthRoutes = require('./routes/healthRoutes');
const forecastRoutes = require('./routes/forecastRoutes')
const eggCollectionRoutes = require('./routes/eggCollectionRoutes');
const fs = require('fs');
const path = require('path');

// Load the data
const dataPath = path.join(__dirname, './data/tarlac_chicken_data.json');
const rawData = fs.readFileSync(dataPath);
const chickenData = JSON.parse(rawData);

require('dotenv').config();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

require('./connection')
app.use('/users', userRoutes)
app.use('/chicken', chickenRoutes);
app.use('/variety', varietyRoutes);
app.use('/breeding', breedingRoutes);
app.use('/forecast', forecastRoutes);
app.use('/health', healthRoutes);
app.use('/eggCollection', eggCollectionRoutes);


// Middleware
app.use(bodyParser.json());
const PORT = process.env.PORT || 5002;
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'PUT']
  }
})

// Move this outside the socket.io connection
app.delete('/logout', async (req, res) => {
  try {
    const { _id, newMessages } = req.body;
    const user = await User.findById(_id);
    // Perform the necessary operations on user and newMessages here
    await user.save();
    const members = await User.find();
    res.status(200).json( {message: 'Your successfully logout'});
  } catch (e) {
    console.error(e);
    res.status(400).send();
  }
});

// Handle user deletion using a more consistent endpoint
app.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete user.' });
  }
});


app.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = req.body;

    // Check if a new password is provided
    if (updatedUser.password) {
      const saltRounds = 10; // Adjust the number of salt rounds as needed
      const hashedPassword = await bcrypt.hash(updatedUser.password, saltRounds);
      updatedUser.password = hashedPassword;
    }

    // Update the user in the database
    const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

// Add this route to handle user deletion
app.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: 'Failed to delete user.' });
  }
});

app.get('/UserInformation', (req, res) => {
  User.find()
  .then(users => res.json(users))
  .catch(err => res.json(err))
})

server.listen(PORT, ()=> {
  console.log(`listening to ${PORT} Atlas mongodb`)
})
