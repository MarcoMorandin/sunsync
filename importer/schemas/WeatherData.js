const { Schema, model } = require('mongoose')

const PvData = new Schema(
    {
        _id: Schema.ObjectId,
        time: Date,
        rain: Number,
        temperature: Number,
        humidity: Number,
        wind_direction: Number,
        wind_speed: Number,
        pressure: Number,
        solar_power: Number,
        metadata: {
            ws_id: Schema.ObjectId,
            description: String,
            location: { alt: Number, lat: Number, long: Number }
        }
    },
    {
        timeseries: {
            timeField: 'time',
            metaField: 'metadata'
        }
    }
)

module.exports = model('weather_data', PvData)
