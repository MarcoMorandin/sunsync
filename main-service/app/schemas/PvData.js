const { Schema, model } = require("mongoose");

const PvData = new Schema(
    {
        time: Date,
        power: Number,
        metadata: {
            pv_id: Schema.ObjectId,
            description: String,
            installed_power: Number,
            location: {alt: Number, lat: Number, long: Number},
            ws_id: Schema.ObjectId,
        }
    },
    {
        timeseries: {
            timeField: 'time',
            metaField: 'metadata'
        },
    }
);

module.exports = model("pv_data", PvData);
