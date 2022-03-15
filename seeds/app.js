const Customer = require('../models/customer');
const customers = require('./allCustomers');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Banking');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

const seedDB = async () => {
    await Customer.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const c = new Customer({
            name: `${customers[i].name}`,
            email: `${customers[i].email}`,
            balance: `${customers[i].balance}`
        })
        await c.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})