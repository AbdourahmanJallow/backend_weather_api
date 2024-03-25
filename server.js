require('dotenv').config({ path: './config/config.env' });

const connectDB = require('./config/dbconnection');

const app = require('express')();

// Route Imports
const weather = require('./routes/weather');

// Middleware configuration
const errorHandler = require('./middleware/error');

connectDB();

// Routes
app.use('/api/v1/weatherapi', weather);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () =>
    console.log(`Server listening on port ${PORT}.`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);

    // close server & exit process
    server.close(() => process.exit(1));
});
