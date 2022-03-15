if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const Customer = require('./models/customer');
const Transfer = require('./models/transfer')
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const dbUrl = process.env.DB_URL;

const mongoose = require('mongoose');
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/customers', async (req, res) => {
    const customers = await Customer.find({});
    res.render('customers/index', { customers });
})

app.get('/customers/:id', async (req, res) => {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    customer.populate('transfers')
        .then(p => {
            const c = p.transfers;
            res.render('customers/show', { c, p });
        })
        .catch(err => console.log(err));
})

app.get('/customers/:id/choose', async (req, res) => {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    const customers = await Customer.find({});
    res.render('customers/choose', { customers, customer });
})

app.get('/customers/:idTo/send/:id', async (req, res) => {
    const { idTo, id } = req.params;
    const customerTo = await Customer.findById(idTo);
    const customer = await Customer.findById(id);
    res.render('customers/money', { customerTo, customer });
})

app.put('/customers/:idTo/:id', async (req, res) => {
    const { idTo, id } = req.params;
    const customerTo = await Customer.findByIdAndUpdate(idTo, { ...req.body.customerTo });
    const customer = await Customer.findByIdAndUpdate(id, { ...req.body.customer });
    const transfer = new Transfer(req.body.transfer);
    customer.transfers.push(transfer);
    await transfer.save();
    await customer.save();
    res.redirect(`/customers/${customer._id}`);
})

const port = process.env.PORT || '3000'
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})