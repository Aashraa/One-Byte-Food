const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema({
    userName: String,
    emailAddress: String,
    date: Date,
    time: String,
    message: String,
    tableNumbers: Array
});

module.exports=mongoose.model("reservations",dataSchema);