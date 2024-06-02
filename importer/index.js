const schedule = require('node-schedule')
const mongoose = require('mongoose')
require('dotenv').config()
const { ObjectId } = require('mongodb')
const axios = require('axios')

const PvInfo = require('./schemas/PvSystem')
const PvData = require('./schemas/PvData')
const WeatherStation = require('./schemas/WeatherStation')
const WsData = require('./schemas/WeatherData')
const Event = require('./schemas/Event')

let date = new Date(Date.parse('2015-02-01T01:00:00.000Z'))
let weather = {
    today: [],
    tomorrow: []
}

/**
 * Generate peak event if predicted production is high
 * @param {*} pv_info pv system related to the event
 * @param {*} predicted_power power predicted for the next day
 */
const tomorrowPredictionEventHandler = async (pv_info, predicted_power) => {
    if ((predicted_power / (pv_info.installed_power * 5)) * 100 > 30) {
        const event = new Event({
            _id: new ObjectId(),
            time: new Date(),
            description: 'peak',
            value: predicted_power,
            pv_info: pv_info
        })
        event.save()
    }
}

/**
 * Parse weather data received from simulator
 * @param {*} wst weather station
 * @param {*} wsDataResp response from simulator
 * @returns parsed weather data or null if error
 */
const handleWheaterResponse = async (wst, wsDataResp) => {
    let wsDataTemp = wsDataResp.data
    if (!wsDataTemp['error']) {
        const data = {
            _id: new ObjectId(),
            time: new Date(date.toISOString()),
            metadata: {
                description: wst['description'],
                location: wst['location'],
                ws_id: wst['_id']
            },
            rain: wsDataTemp['rain'],
            humidity: wsDataTemp['umid'],
            wind_speed: wsDataTemp['velVen'],
            pressure: wsDataTemp['pres'],
            temperature: wsDataTemp['temp'],
            solar_power: (wsDataTemp['rad'] * 0.278).toFixed(3),
            wind_direction: wsDataTemp['dirVen']
        }
        return data
    }
    return null
}

/**
 * Get Weather data from simulator and insert in Mongo
 */
const loadWsData = async () => {
    let wsts = await WeatherStation.find({})
    let tomorrow = new Date(date)
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
    for (let wst_index in wsts) {
        let wst = wsts[wst_index]
        console.log('wsdata: ' + wst.description)
        let wsDataResp = await axios.get(wst.url + date.toISOString().split('T')[0])
        let result = await handleWheaterResponse(wst, wsDataResp)
        if (result != null) {
            weather.today.push(result)
            await WsData.create(result)
        }

        wsDataResp = await axios.get(wst.url + tomorrow.toISOString().split('T')[0])
        result = await handleWheaterResponse(wst, wsDataResp)
        if (result != null) {
            weather.tomorrow.push(result)
            await WsData.create(result)
        }
    }
}

/**
 * Load pv data from simulator for the current day
 * Get prediction for current day and tomorrow to compute maintenance needed
 * or high power prediction from weather data
 */
const loadPvData = async () => {
    const response = await fetch('https://simulator-n1ou.onrender.com/api/v1/pun/' + date.toISOString().split('T')[0])
    const resp = await response.json()
    let price = 0
    if (!resp['error']) {
        price = resp['price']
    }
    let pvs = await PvInfo.find({})
    for (let pv_index in pvs) {
        let pv = pvs[pv_index]
        console.log('pvdata: ' + pv['description'])
        await axios.get(pv['url'] + date.toISOString().split('T')[0]).then(async (pvDataResp) => {
            let pvDataTemp = pvDataResp.data
            if (!pvDataTemp.error) {
                let wsDataToday = weather.today[weather.today.map((w) => w.metadata.ws_id.toString()).indexOf(pv.ws_id.toString())]
                let wsDataTodayPrompt = {
                    installed_power: pv.installed_power,
                    rain: wsDataToday.rain,
                    temperature: wsDataToday.temperature,
                    humidity: wsDataToday.humidity,
                    wind_speed: wsDataToday.wind_speed,
                    solar_power: Number(wsDataToday.solar_power),
                    wind_direction: wsDataToday.wind_direction
                }

                let wsDataTomorrow = weather.tomorrow[weather.tomorrow.map((w) => w.metadata.ws_id.toString()).indexOf(pv.ws_id.toString())]
                let wsDataTomorrowPrompt = {
                    installed_power: pv.installed_power,
                    rain: wsDataTomorrow.rain,
                    temperature: wsDataTomorrow.temperature,
                    humidity: wsDataTomorrow.humidity,
                    wind_speed: wsDataTomorrow.wind_speed,
                    solar_power: Number(wsDataTomorrow.solar_power),
                    wind_direction: wsDataTomorrow.wind_direction
                }
                await axios.post(process.env.PREDICTION_URL, [wsDataTodayPrompt, wsDataTomorrowPrompt]).then(async (predictionsResp) => {
                    let predictions = predictionsResp.data.predictions
                    tomorrowPredictionEventHandler(pv, Math.abs(predictions[1]))
                    await PvData.create({
                        _id: new ObjectId(),
                        time: new Date(date.toISOString()),
                        metadata: {
                            description: pv.description,
                            location: pv.location,
                            installed_power: pv.installed_power,
                            ws_id: pv.ws_id,
                            pv_id: pv._id,
                            price: price
                        },
                        power: pvDataTemp.power,
                        predicted_power: Math.abs(predictions[0]),
                        tomorrow_predicted_power: Math.abs(predictions[1])
                    })
                })
            }
        })
    }
}

function importData() {
    console.log(date.toISOString())
    mongoose.set('strictQuery', true)
    db = mongoose.connect(`mongodb+srv://${process.env.MONGO_UNAME}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}`).then(async () => {
        await loadWsData()
        await loadPvData()
        weather.today = []
        weather.tomorrow = []
    })

    date.setUTCDate(date.getUTCDate() + 1)
}

// avvio della routine e scheduling...
importData()
setInterval(importData, 10000)


/**
 * scheduled import of data every day at same time
 */

/**
 * Get daily PUN from Terna API
 * Not used but ready for real scenario
 * @param {*} date date of the price
 */
const getTernaPrice = async (date) => {
    const params = new URLSearchParams()
    params.append('client_id', process.env.TERNAUID)
    params.append('client_secret', process.env.TERNASECRET)
    params.append('grant_type', 'client_credentials')
    const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    let credentials = await axios.post('https://api.terna.it/transparency/oauth/accessToken', params, config)
        .then((resp) => {
            return resp
        })
        .catch((err) => {
            return {
                "access_token": null
            }
        })
    
    let result = await axios.get('https://api.terna.it/market-and-fees/v1.0/daily-prices',
        {
            headers: {
                "Authorization" : "Bearer " + credentials.data.access_token,
                "Accept": "application/json"
            },
            params: {
                dateFrom: date,
                dateTo: date,
                dateType: 'Orario'
            }
        }
    )
        .then((resp) => {
            return resp
        })
        .catch((err) => {
            console.log(err)
            return {
                data:{
                    daily_prices: [
                        {
                            base_price_EURxMWh: 0
                        }
                    ]
                }
            }
        })
    
    let sum = 0
    let cont = 0
    for(; cont < result.data.daily_prices.length; cont++) {
        sum += Number(result.data.daily_prices[cont].base_price_EURxMWh)
    }

    return (sum/cont)/1000000
}

var today  = new Date();
today = new Date(today.setUTCDate(today.getUTCDate() - 1))
var reqDate = (today.getDate() < 10? '0'+today.getDate(): today.getDate()) + '/' + (today.getMonth()+1 < 10? '0'+(today.getMonth()+1): today.getMonth()+1) + '/' + today.getFullYear()

/*console.log(reqDate)
getTernaPrice(reqDate).then((res) => {
    console.log("prezzo: " + res.toFixed(10))
    return res.toFixed(10)
})*/

// TODO importer da sito meteotrentino...

/*schedule.scheduleJob('0 1 * * *', importData);*/
