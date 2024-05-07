const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema({
    userName: String,
    emailAddress: String,
    date: Date,
    time: String,
    tableNumbers: Array
});

module.exports=mongoose.model("reservations",dataSchema);