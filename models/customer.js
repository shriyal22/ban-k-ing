const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    name: String,
    email: String,
    balance: Number,
    transfers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Transfer'
        }
    ]
});

module.exports = mongoose.model('Customer', CustomerSchema);