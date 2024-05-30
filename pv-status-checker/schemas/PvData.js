const { Schema, model } = require('mongoose')

const PvData = new Schema(
    {
        _id: Schema.ObjectId,
        time: Date,
        power: Number,
        predicted_power: Number,
        metadata: {
            pv_id: Schema.ObjectId,
            description: String,
            installed_power: Number,
            price: Number,
            location: { alt: Number, lat: Number, long: Number },
            ws_id: Schema.ObjectId
        }
    },
    {
        timeseries: {
            timeField: 'time',
            metaField: 'metadata'
        }
    }
)

module.exports = model('pv_data', PvData)
