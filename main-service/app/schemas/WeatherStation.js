const { Schema, model } = require("mongoose");

/**
 * Oggetto che modella la stazione meteo presente nel DB
 */
const WeatherStation = new Schema({
    _id: Schema.ObjectId,
    description: String,
    location: {alt: Number, lat: Number, long: Number,},
    url: String,
});

module.exports = model("weather_info", WeatherStation);
