const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = 3001;
const DB_URL = 'mongodb://localhost:27017/onebytefood';

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose.connect(DB_URL)
    .then(() => console.log("Connected to Database"))
    .catch(error => console.error("Error in Connecting to Database:", error));

// Schema and Model
const dataSchema = new mongoose.Schema({
    userName: String,
    emailAddress: String,
    date: Date,
    time: String,
    tableNumbers: Array
});
const Data = mongoose.model('reservations', dataSchema);

// Routes
app.post("/sign_in", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await mongoose.connection.collection('customersignup').findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.password === password) {
            console.log("Login successful:", user.name);
            return res.status(200).json({ success: true, name: user.name });
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
        await mongoose.connection.collection('customersignup').insertOne({ name, email, password });
        console.log("User registered:", name);
        return res.status(200).json({ success: true, name });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: 'Something went wrong with the server' });
    }
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
        const reservedSeats = await Data.find().distinct('tableNumbers');

        res.json(reservedSeats);
    } catch (error) {
        console.error('Error fetching reserved seats:', error);
        res.status(500).json({ message: 'Failed to fetch reserved seats' });
    }
});


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