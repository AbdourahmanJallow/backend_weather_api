const asyncHandler = require('../middleware/async');
const Weather = require('../models/weather');
const ErrorResponse = require('../utils/errorHandler');

/**@des         Get weather details for a city
 * @route       GET api/v1/weather/:location
 * @access      public
 * @returns     {Object} weather
 */
exports.getWeather = asyncHandler(async (req, res, next) => {
    let weather = await Weather.findOne({ city: req.params.location });

    if (weather) {
        return res.json({
            success: true,
            data: weather
        });
    }

    const api_key = process.env.OPENWEATHER_API_KEY;

    const geolocationData = await fetchGeolocationData(api_key, req.params.location)

    const weather_info = await fetchWeatherData(api_key, geolocationData);

    weather = await Weather.create({
        city: req.params.location,
        countryCode: weather_info.sys.country,
        humidity: weather_info.main.humidity,
        visibity: weather_info.visibity,
        coordinates: {
            ...weather_info.coord
        },
        temperature: {
            current: weather_info.main.temp,
            min_temp: weather_info.main.temp_min,
            max_temp: weather_info.main.temp_max
        },
        wind: {
            windspeed: weather_info.wind.speed,
            direction: weather_info.wind.deg
        },
        weather: {
            description: weather_info.weather[0].description,
            icon: weather_info.weather[0].icon,
            sunrise: weather_info.sys.sunrise,
            sunset: weather_info.sys.sunset
        }
    });

    res.json({
        success: true,
        data: weather
    });
});

const fetchGeolocationData = async (api_key, location)=>{
    const geocode = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${api_key}`
    );

    const coordinates = await geocode.json();

    if (!coordinates || coordinates.length === 0) {
        return next(
            new ErrorResponse(`Invalid location name ${req.params.location}`)
        );
    }

    return coordinates[0]
}

const fetchWeatherData = async (api_key, coord)=>{
    const data = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coord
            .lat}&lon=${coord?.lon}&units=metric&appid=${api_key}`
    );

    const weather_info = await data.json();

    if (!weather_info) {
        return next(
            new ErrorResponse(
                `No weather information for location ${req.params.location}`
            )
        );
    }

    return weather_info;
}