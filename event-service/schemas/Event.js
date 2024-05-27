const { Schema, model } = require("mongoose");

const Event = new Schema(
    {
        _id: Schema.ObjectId,
        time: Date,
        description: String,
        what: { type: Schema.Types.ObjectId, ref: 'PvSystem' },
    }
);

module.exports = model("event", Event);
