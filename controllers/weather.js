const asyncHandler = require('../middleware/async');

/**@des         Get weather details for a city
 * @route       GET api/v1/weather
 * @access      public
 * @returns     {Object} weather
 */
exports.getWeather = asyncHandler(async (req, res, next) => {
    const api_key = process.env.OPENWEATHER_API_KEY;

    const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=${api_key}`
    );

    const coord = await response.json();

    const data = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coord[0].lat}&lon=${coord[0].lon}&appid=${api_key}`
    );

    const weather_info = await data.json();

    res.json({
        success: true,
        data: { city_name: coord[0].name, weather_info }
    });
});
