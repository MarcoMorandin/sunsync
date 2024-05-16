const { Schema, model } = require("mongoose");

/**
 * Oggetto che modella l'impianto fotovoltaico presente nel DB
 */
const PvSystem = new Schema({
    _id: Schema.ObjectId,
    description: String,
    installed_power: Number,
    location: {alt: Number, lat: Number, long: Number,},
    url: String,
    ws_id: Schema.ObjectId,
});

module.exports = model("pv_info", PvSystem);
