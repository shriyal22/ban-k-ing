const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transferSchema = new Schema({
    receiver: String,
    money: Number
});

module.exports = mongoose.model('Transfer', transferSchema);