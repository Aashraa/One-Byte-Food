require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser=require("cookie-parser");
const flash = require("connect-flash");


const app = express();
const PORT = process.env.PORT || 4000; // Default to 4000 if PORT is not set in the environment
const DB_URI = process.env.DB_URI; // Get MongoDB URI from environment variable

// Database connection
mongoose.connect(DB_URI);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'my secret key',
    cookie:{maxAge:6000},
    saveUninitialized: true,
    resave: false,
}));

app.use(flash());

app.get("/customers", async (req, res) => {
    try {
        // Fetch user data from the database
        const users = await mongoose.connection.collection('userdetails').find().toArray();
        
        // Render the HTML template with user data
        res.render("customers", { title: "Customer Table", users: users });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Something went wrong with the server' });
    }
});

// Define the route to fetch the number of customers
app.get("/customer-count", async (req, res) => {
    try {
        const numberOfCustomers = await mongoose.connection.collection('userdetails').countDocuments();
        res.json({ numberOfCustomers });
    } catch (error) {
        console.error('Error fetching number of customers:', error);
        res.status(500).json({ message: 'Failed to fetch number of customers' });
    }
}); 

app.get("/index", async (req, res) => {
    try {
        // Fetch user data from the database
        const users = await mongoose.connection.collection('reservations').find().toArray();
        
        // Render the HTML template with user data
        res.render("index", { title: "Customer Table", users: users });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Something went wrong with the server' });
    }
});

// Define the route to fetch the number of customers
app.get("/reservation-count", async (req, res) => {
    try {
        const numberOfReservations = await mongoose.connection.collection('reservations').countDocuments();
        res.json({ numberOfReservations });
    } catch (error) {
        console.error('Error fetching number of customers:', error);
        res.status(500).json({ message: 'Failed to fetch number of customers' });
    }
}); 


app.use((req, res, next) => {
    res.locals.session = req.session.message;
    delete req.session.message;
    next();
});

// Set template engine
app.set("view engine", "ejs");

// Routes prefix
app.use("", require("./routes/routes"));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
