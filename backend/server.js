require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const docsRoutes = require('./routes/docs');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/components', require('./routes/components'));
app.use('/api/borrowings', require('./routes/borrowings'));
app.use('/api/borrow-requests', require('./routes/borrow-requests'));
app.use('/api/docs', docsRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// Basic Route
app.get('/', (req, res) => {
    res.send('IoT Inventory API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
