/*const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})*/

const mongoose = require("mongoose");

const User = require("./schemas/User");
const PvData = require("./schemas/PvData");
const PvSystem = require("./schemas/PvSystem");
const WeatherData = require("./schemas/WeatherData");
const WeatherStation = require("./schemas/WeatherStation");

const main = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect("mongodb+srv://sunsync:sunsync@sunsync.njat6nf.mongodb.net/SunSync?retryWrites=true&w=majority&appName=SunSync");

  //let a = await PvData.create({time: new Date("2015-07-31T02:00:00"), power: 12000, metadata: { pv_id: 20, description: "TRENTO_Sede Nucleo Elicotteri", installed_power: 8572, ws_id: 0, location: { lat: 46.026944, long: 11.126944, alt: 193 }}});
  //console.log(a);

  let system = await User.find({});
  console.log(system[0]);
}
main();
