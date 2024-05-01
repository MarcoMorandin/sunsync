const { Schema, model } = require("mongoose");

const PvSystem = new Schema({
    _id: Number,
    description: String,
    installed_power: Number,
    location: {alt: Number, lat: Number, long: Number,},
    url: String,
    ws_id: Number,
});

module.exports = model("pv_info", PvSystem);
