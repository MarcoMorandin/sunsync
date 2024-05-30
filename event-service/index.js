const mongoose = require('mongoose');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const { Telegraf } = require('telegraf');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(token);

const emoji = require('node-emoji');
const PvInfo = require('./schemas/PvSystem');
const Event = require('./schemas/Event');
const User = require('./schemas/User');
const TelegramChat = require('./schemas/TelegramChat');

const botManager = () => {
    bot.start(async (ctx) => {
        await ctx.reply('Benvenuto nel bot SunSync');
        ctx.reply(
            'Per poter ricevere le notifiche della manutenzione inviami il token con il comando /token che trovi nel tuo profilo nella webapp',
        );
    });

    bot.command('token', async (ctx) => {
        let token = ctx.message.text.split('/token')[1].trim();
        if (token.length == 0 || token == null) {
            ctx.reply('Token non valido');
        } else {
            let users = await User.find({ bot_token: token });
            if (users.length != 1) ctx.reply('Token non valido');
            else {
                for (let i = 0; i < 3; i++) {
                    await ctx.deleteMessage(ctx.message.message_id - i);
                }
                await ctx.reply('Buongiorno, ' + users[0].username);
                ctx.reply(
                    'Da questo momento inizierai a ricevere una notifica ogni qual volta un impianto fotovoltaico avrà bisogno di manutenzione',
                );

                let telegramChat = await TelegramChat.find({
                    chatId: ctx.message.chat.id,
                });
                if (telegramChat.length == 0 || telegramChat == null) {
                    await TelegramChat.create({
                        chatId: ctx.message.chat.id,
                    });
                }
            }
        }
    });

    bot.launch();
};

const createEvent = () => {
    mongoose.set('strictQuery', true);
    db = mongoose
        .connect(
            `mongodb+srv://${process.env.MONGO_UNAME}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}`,
        )
        .then(async () => {
            PvInfo.watch().on('change', async (data) => {
                if (
                    data.operationType == 'update' &&
                    data.updateDescription.updatedFields.status == 'warning'
                ) {
                    let pv_info = await PvInfo.findById(data.documentKey._id);
                    const event = new Event({
                        _id: new ObjectId(),
                        time: data.wallTime,
                        description:
                            data.updateDescription.updatedFields.status,
                        pv_info: pv_info,
                    });
                    event.save();
                }
            });
            Event.watch().on('change', async (data) => {
                let event = await Event.findById(data.documentKey._id);
                let pvInfo = await PvInfo.findById(event.pv_info._id);
                let chats = await TelegramChat.find({});
                chats.forEach((chat) => {
                    if (event.description == 'warning') {
                        bot.telegram.sendMessage(
                            chat.chatId,
                            `${emoji.get('warning')}${emoji.get(
                                'warning',
                            )} L'impianto "${
                                pvInfo.description
                            }" ha bisogno di manutenzione ${emoji.get(
                                'warning',
                            )}${emoji.get('warning')}`,
                        );
                        bot.telegram.sendLocation(
                            chat.chatId,
                            pvInfo.location.lat,
                            pvInfo.location.long,
                        );
                    } else if (event.description == 'peak') {
                        bot.telegram.sendMessage(
                            chat.chatId,
                            `${emoji.get('zap')}${emoji.get(
                                'zap',
                            )} L'impianto "${
                                pvInfo.description
                            }" domani produrrà molta energia: ${event.value.toFixed(2) / 1000} kWh ${emoji.get(
                                'zap',
                            )}${emoji.get('zap')}`,
                        );
                    }
                });
            });
            botManager();
        });
};

createEvent();
