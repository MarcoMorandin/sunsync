const { Schema, model } = require("mongoose");

const User = new Schema({
    _id: Schema.ObjectId,
    username: String,
    password: String,
    forecast_notification: Boolean,
    maintenance_notification: Boolean,
    role: Number,
});

module.exports = model("user", User);