const { Schema, model } = require("mongoose");

const WeatherStation = new Schema({
    _id: Schema.ObjectId,
    description: String,
    location: {alt: Number, lat: Number, long: Number,},
    url: String,
});

module.exports = model("weather_info", WeatherStation);
