const { Schema, model } = require('mongoose')

const PvSystem = new Schema({
    _id: Schema.ObjectId,
    description: String,
    installed_power: Number,
    location: { alt: Number, lat: Number, long: Number },
    url: String,
<<<<<<< HEAD
    ws_id: Schema.ObjectId
})
=======
    ws_id: Schema.ObjectId,
    status: String
});
>>>>>>> b05f22982478406b24082669d353e77b6c2fae18

module.exports = model('pv_info', PvSystem)
