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
require("dotenv").config();

const User = require("./app/schemas/User");
const PvData = require("./app/schemas/PvData");
const PvSystem = require("./app/schemas/PvSystem");
const WeatherData = require("./app/schemas/WeatherData");
const WeatherStation = require("./app/schemas/WeatherStation");

const main = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(`mongodb+srv://${process.env.MONGO_UNAME}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}`);

  //let a = await PvData.create({time: new Date("2015-07-31T02:00:00"), power: 12000, metadata: { pv_id: 20, description: "TRENTO_Sede Nucleo Elicotteri", installed_power: 8572, ws_id: 0, location: { lat: 46.026944, long: 11.126944, alt: 193 }}});
  //console.log(a);

  let system = await User.find({});
  console.log(system[0]);
}
main();
