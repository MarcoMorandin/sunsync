const { Schema, model } = require("mongoose");

const TelegramChat = new Schema({
    chatId: String
});

module.exports = model("telegramChat", TelegramChat);
