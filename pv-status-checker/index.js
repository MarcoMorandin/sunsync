// import schedule from 'node-schedule';
const PvData = require('./schemas/PvData')
const PvSystem = require('./schemas/PvSystem')
const mongoose = require('mongoose')
require('dotenv').config()
const { ObjectId } = require('mongodb')

async function importData() {
    mongoose.set('strictQuery', true)
    db = mongoose.connect(`mongodb+srv://${process.env.MONGO_UNAME}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}`).then(async () => {
        let infos = await PvSystem.find({})
        infos.forEach(async (info) => {
            data = await PvData.aggregate([
                {
                    $match: {
                        'metadata.pv_id': new ObjectId(info._id)
                    }
                },
                {
                    $sort: {
                        time: -1
                    }
                },
                {
                    $group: {
                        _id: '$metadata.pv_id',
                        documents: {
                            $push: '$$ROOT'
                        }
                    }
                },
                {
                    $project: {
                        last_30_documents: {
                            $slice: ['$documents', 30]
                        }
                    }
                },
                {
                    $unwind: '$last_30_documents'
                },
                {
                    $replaceRoot: {
                        newRoot: '$last_30_documents'
                    }
                }
            ])
            let sum = 0
            data.forEach((d, i) => {
                sum += d.power - d.predicted_power
            })
            if (sum / data.length < -20000) {
                await PvSystem.updateOne({ _id: new ObjectId(info._id) }, { status: 'warning' })
                    .then(console.log({ _id: new ObjectId(info._id) }, { status: 'warning' }))
                    .catch((err) => console.log(err))
            } else
                await PvSystem.updateOne({ _id: new ObjectId(info._id) }, { status: 'ok' })
                    .then(console.log({ _id: new ObjectId(info._id) }, { status: 'ok' }))
                    .catch((err) => console.log(err))
        })
    })
}

// avvio della routine e scheduling...
importData()
setInterval(importData, 600000)

/*schedule.scheduleJob('0 1 * * *', importData);*/
