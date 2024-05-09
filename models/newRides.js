const mongoose = require("mongoose");

const newRideSchema = new mongoose.Schema({
    name: String,
    start: String,
    destination: String,
    route: String,
    startTime: String
});


// user otp model
const newRide= new mongoose.model("ride",newRideSchema);

module.exports = newRide