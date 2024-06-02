const { Schema, model } = require('mongoose');

const TelegramChat = new Schema({
    _id: Schema.ObjectId,
    chatId: String,
});

module.exports = model('telegramChat', TelegramChat);
