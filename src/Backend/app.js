const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/Login_Test', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  email: String,
  password: String,
  habits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Habit' }],
});

const habitSchema = new mongoose.Schema({
  name: String,
  completedDays: Number,
  createdOn: String,
  url: String,
  weekStatus: [Boolean],
});

const User = mongoose.model('User', userSchema);
const Habit = mongoose.model('Habit', habitSchema);

app.post('/signup', async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const userData = await User.findOne({ username });
    res.status(201).json({ message: 'User created successfully', user: userData });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Internal Server Error during signup' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal Server Error during login' });
  }
});

app.post('/api/saveUserDetails', async (req, res) => {
  try {
    const { username, habits } = req.body;

    const habitObjects = await Habit.create(habits);

    const user = await User.findOneAndUpdate(
      { username },
      { $set: { habits: habitObjects.map(habit => habit._id) } },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
app.get('/api/getUserDetails/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).populate('habits');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Middleware to handle errors when the server is not found
app.use((err, req, res, next) => {
  if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    res.status(500).json({ error: 'Server not found. Please try again later.' });
  } else {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
