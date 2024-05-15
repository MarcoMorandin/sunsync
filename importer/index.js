const schedule = require('node-schedule')
const mongoose = require('mongoose');
require("dotenv").config();
const { ObjectId } = require('mongodb');
const axios = require('axios');

const PvInfo = require('./schemas/PvSystem');
const PvData = require('./schemas/PvData');
const WeatherStation = require('./schemas/WeatherStation');
const WsData = require('./schemas/WeatherData');

/**
 * scheduled import of data every 10 seconds
 */
let date = new Date(Date.parse("2012-12-21T00:00:00.000Z"));

function importData() {
    console.log(date.toISOString());

    mongoose.set('strictQuery', true);
    db = mongoose.connect(`mongodb+srv://${process.env.MONGO_UNAME}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}`)
    .then ( async () => {
        let pvs = await PvInfo.find({});
        let wst = await WeatherStation.find({});

        for(let el of wst) {
            console.log("wsdata: " + el['description']);

            await axios.get(el['url'] + date.toISOString().split('T')[0]).then( async (resp) => {
                const data = resp['data'];
                console.log(data);

                if(!data["error"]){
                    let dayData = {
                        _id: new ObjectId(),
                        time: new Date(date.toISOString()),
                        metadata: {
                            description: el['description'],
                            location: el['location'],
                            ws_id: el['_id']
                        },
                        rain: data['rain'],
                        humidity: data['umid'],
                        wind_speed: data['velVen'],
                        pressure: data['pres'],
                        temperature: data['temp'],
                        solar_power: (data['rad'] * 0.278).toFixed(3),
                        wind_direction: data['dirVen']
                    };
        
                    await WsData.create(dayData);
                }
            });
        }

        const response = await fetch("https://simulator-n1ou.onrender.com/api/v1/pun/" + date.toISOString().split('T')[0]);
        const resp = await response.json();
        let price = 0;
        if(!resp["error"]){
            price = resp['price'];
        }

        for(let el of pvs) {
            console.log("pvdata: " + el['description']);

            await axios.get(el['url'] + date.toISOString().split('T')[0]).then( async (resp) => {
                const data = resp['data'];
                console.log(data);

                if(!data["error"]){
                    let dayData = {
                        _id: new ObjectId(),
                        time: new Date(date.toISOString()),
                        metadata: {
                            description: el['description'],
                            location: el['location'],
                            installed_power: el['installed_power'],
                            ws_id: el['ws_id'],
                            pv_id: el['_id'],
                            price: price
                        },
                        power: data['power']
                    };
        
                    await PvData.create(dayData);
                }
            });
        }
    });

    date.setUTCDate(date.getUTCDate() + 1);
}

importData();
setInterval(importData, 50000);

/**
 * scheduled import of data every day at same time
 */
/*

// TODO importer da sito meteotrentino e Terna...

schedule.scheduleJob('0 1 * * *', importData);*/