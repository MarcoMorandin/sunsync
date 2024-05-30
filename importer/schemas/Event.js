const { Schema, model } = require("mongoose");

const Event = new Schema(
    {
        _id: Schema.ObjectId,
        time: Date,
        description: String,
        value: Number,
        pv_info: { 
            _id: Schema.ObjectId,
            description: String,
            installed_power: Number,
            location: {alt: Number, lat: Number, long: Number,},
            url: String,
            ws_id: Schema.ObjectId,
            status: String
        },
    }
);

module.exports = model("event", Event);
