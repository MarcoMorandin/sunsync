const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');

const PvSystem = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description: String,
    installed_power: Number,
    location: {alt: Number, lat: Number, long: Number,},
    url: String,
    ws_id: mongoose.Schema.Types.ObjectId,
});

module.exports = model("pv_info", PvSystem);
