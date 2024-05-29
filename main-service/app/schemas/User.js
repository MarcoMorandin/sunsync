const { Schema, model } = require("mongoose");

/**
 * Oggetto che modella l'utente presente nel DB
 */
const User = new Schema({
    _id: Schema.ObjectId,
    username: String,
    mail: String,
    password: String,
    forecast_notification: Boolean,
    maintenance_notification: Boolean,
    role: Number,
    disabled: Boolean,
    salt: String,
    bot_token: String,
});

module.exports = model("user", User);
