const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/v1/user');

// Routes
app.use('/api/auth', authRoutes);
app.use('/v1/user', userRoutes);

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/your_database_name'; // for local MongoDB
// OR for MongoDB Atlas
// const MONGODB_URI = 'mongodb+srv://username:password@cluster.mongodb.net/your_database_name';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Mochi Manga API' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 