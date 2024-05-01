const { Schema, model } = require("mongoose");

const WeatherStation = new Schema({
    _id: Number,
    description: String,
    location: {alt: Number, lat: Number, long: Number,},
    url: String,
});

module.exports = model("weather_info", WeatherStation);
