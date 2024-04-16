const mongoose = require('mongoose');

// Define Mongoose schema
const weatherSchema = new mongoose.Schema(
    {
        city: String,
        // cityCode: Number,
        countryCode: String,
        coordinates: {
            lat: String,
            lon: String
        },
        humidity: String,
        temperature: {
            current: String,
            min_temp: String,
            max_temp: String
        },
        visibity: String,
        wind: {
            windspeed: String,
            direction: Number
        },
        weather: {
            description: String,
            icon: String,
            sunrise: String,
            sunset: String
        }
    },
    { timestamps: true }
);

// Create a Mongoose model
const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;
