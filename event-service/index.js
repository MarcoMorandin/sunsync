const mongoose = require('mongoose');
require("dotenv").config();
const { ObjectId } = require('mongodb');


const PvInfo = require('./schemas/PvSystem');
const Event = require('./schemas/Event')
function importData() {
    mongoose.set('strictQuery', true);
    db = mongoose.connect(`mongodb+srv://${process.env.MONGO_UNAME}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}`)
    .then ( async () => {

        
        PvInfo.watch().
            on('change', data => {
                if(data.operationType == 'update' && data.updateDescription.updatedFields.status == 'warning'){
                    const event = new Event({
                        _id: new ObjectId(),
                        time: data.wallTime,
                        description: data.updateDescription.updatedFields.status,
                        what: data.documentKey._id
                    })
                    event.save()
                }
            });

        
    });
}

importData();

