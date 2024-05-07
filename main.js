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
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
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
