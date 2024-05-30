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

let date = new Date(Date.parse('2013-10-01T01:00:00.000Z'))
let weather = {
    today: [],
    tomorrow: []
}

const tomorrowPredictionEventHandler = async (pv_info, predicted_power) => {
    if(predicted_power / (pv_info.installed_power * 5) * 100 > 20){
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

const loadWsData = async () => {
    let wsts = await WeatherStation.find({})
    let tomorrow = new Date(date)
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
    for(let wst_index in wsts){
        let wst = wsts[wst_index]
        console.log('wsdata: ' + wst.description)
        let wsDataResp = await axios.get(wst.url + date.toISOString().split('T')[0])
        let result = await handleWheaterResponse(wst, wsDataResp)
        if(result != null){
            weather.today.push(result)
            await WsData.create(result)
        }
        
        wsDataResp = await axios.get(wst.url + tomorrow.toISOString().split('T')[0])
        result = await handleWheaterResponse(wst, wsDataResp)
        if(result != null){
            weather.tomorrow.push(result)
            await WsData.create(result)
        }
    }
}

const loadPvData = async () => {
    const response = await fetch('https://simulator-n1ou.onrender.com/api/v1/pun/' + date.toISOString().split('T')[0])
    const resp = await response.json()
    let price = 0
    if (!resp['error']) {
        price = resp['price']
    }
    let pvs = await PvInfo.find({})
    for(let pv_index in pvs){
        let pv = pvs[pv_index]
        console.log('pvdata: ' + pv['description'])
        await axios.get(pv['url'] + date.toISOString().split('T')[0])
        .then(async (pvDataResp) => {
            let pvDataTemp = pvDataResp.data
            if(!pvDataTemp.error){
                let wsDataToday = weather.today[weather.today.map(w => w.metadata.ws_id.toString()).indexOf(pv.ws_id.toString())]
                let wsDataTodayPrompt = {
                    installed_power: pv.installed_power,
                    rain: wsDataToday.rain,
                    temperature: wsDataToday.temperature,
                    humidity: wsDataToday.humidity,
                    wind_speed: wsDataToday.wind_speed,
                    solar_power: Number(wsDataToday.solar_power),
                    wind_direction: wsDataToday.wind_direction
                }
    
                let wsDataTomorrow = weather.tomorrow[weather.tomorrow.map(w => w.metadata.ws_id.toString()).indexOf(pv.ws_id.toString())]
                let wsDataTomorrowPrompt = {
                    installed_power: pv.installed_power,
                    rain: wsDataTomorrow.rain,
                    temperature: wsDataTomorrow.temperature,
                    humidity: wsDataTomorrow.humidity,
                    wind_speed: wsDataTomorrow.wind_speed,
                    solar_power: Number(wsDataTomorrow.solar_power),
                    wind_direction: wsDataTomorrow.wind_direction
                }
                await axios.post(process.env.PREDICTION_URL, [wsDataTodayPrompt, wsDataTomorrowPrompt])
                .then(async (predictionsResp) => {
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
    db = mongoose.connect(`mongodb+srv://${process.env.MONGO_UNAME}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}`)
    .then(async () => {
        await loadWsData()
        await loadPvData()
        weather.today = []
        weather.tomorrow = []
    })
    
    date.setUTCDate(date.getUTCDate() + 1)
}

importData()
setInterval(importData, 10000)

