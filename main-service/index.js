const app = require('./app/app.js');
const mongoose = require('mongoose');
require("dotenv").config();

mongoose.set('strictQuery', true);
app.locals.db = mongoose.connect(`mongodb+srv://${process.env.MONGO_UNAME}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}`)
.then ( () => {
    
    console.log("Connected to Database");
    
    app.listen(3000, () => {
        console.log(`Server listening on port 3000`);
    });
    
});
