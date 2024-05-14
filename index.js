const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const router = express.Router();

const adminRoutes = require("./routes/routes");
const Reservations = require("./models/users");

const app = express();
const PORT = 3001;
const DB_URL = 'mongodb://localhost:27017/onebytefood';

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'my secret key',
    cookie: { maxAge: 6000 },
    saveUninitialized: true,
    resave: false,
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.session = req.session.message;
    delete req.session.message;
    next();
});

// Database connection
mongoose.connect(DB_URL)
    .then(() => console.log("Connected to Database"))
    .catch(error => console.error("Error in Connecting to Database:", error));

const Data = Reservations;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
};

// Route handler for rendering the admin dashboard
app.get("/views/admin.ejs", isAdmin, (req, res) => {
    res.render("admin", { title: "Admin Dashboard" });
});

// Routes
app.post("/sign_in", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await mongoose.connection.collection('userdetails').findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.password === password) {
            console.log("Login successful:", user.name);
            // Create a session and store session token in session
            req.session.user = user;
            req.session.isAdmin = user.isAdmin;
            return res.status(200).json({ success: true, name: user.name, isAdmin: user.isAdmin });
        } else {
            return res.status(401).send('Credentials do not match');
        }
    } catch (error) {
        console.error("Error in Server:", error);
        return res.status(500).json({ message: 'Something went wrong with the server' });
    }
});

app.post("/sign_up", async (req, res) => {
    try {
        const { username: name, email, password } = req.body;
        await mongoose.connection.collection('userdetails').insertOne({ name, email, password, isAdmin: false});
        console.log("User registered:", name);
        return res.status(200).json({ success: true, name });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: 'Something went wrong with the server' });
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ message: 'Something went wrong with the server' });
        }
        res.clearCookie('sessionToken'); 
        res.redirect('/');
    });
});

app.post('/sendData', async (req, res) => {
    try {
        const dataArray = req.body;
        await Data.insertMany(dataArray);
        console.log('Data saved to MongoDB');
        // Send real-time update to connected clients
        io.emit("reservationUpdate", dataArray);
        return res.sendStatus(200);
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
        return res.sendStatus(500);
    }
});

// Route to get reserved seats from the database
app.get("/getReservedSeats", async (req, res) => {
    try {
        const { date } = req.query;
        const reservedSeats = await Data.find({ date: date }).distinct('tableNumbers');
        res.json(reservedSeats);
    } catch (error) {
        console.error('Error fetching reserved seats:', error);
        res.status(500).json({ message: 'Failed to fetch reserved seats' });
    }
});

app.get("/customers", async (req, res) => {
    try {
        const numberOfCustomers = await Customer.countDocuments();
        res.json({ numberOfCustomers });
    } catch (error) {
        console.error('Error fetching number of customers:', error);
        res.status(500).json({ message: 'Failed to fetch number of customers' });
    }
});

// Admin Routes
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
    res.set("Allow-acces-Allow-Origin", '*');
    res.redirect('/homepage/homepage.html');
});

// Start server
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

module.exports = router;