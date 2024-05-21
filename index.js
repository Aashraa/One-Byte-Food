<<<<<<< HEAD
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const router = express.Router();

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
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
    saveUninitialized: true,
    resave: false,
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.session = req.session.message;
    delete req.session.message;
    next();
});

// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login.html'); // Redirect to login page if user is not logged in
    }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
};

// Database connection
mongoose.connect(DB_URL)
    .then(() => console.log("Connected to Database"))
    .catch(error => console.error("Error in Connecting to Database:", error));

const Data = Reservations;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Route handler for rendering the admin dashboard
app.get("/views/admin.ejs", isAdmin, (req, res) => {
    res.render("admin", { title: "Admin Dashboard" });
});

const cors = require('cors');
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3001', // Add the origin of your client-side application
}));

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
            // Set session token in cookie
            res.cookie('sessionToken', req.sessionID, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' // Use secure cookies in production
            });

            // Redirect to corresponding page
            if (user.isAdmin) {
                res.redirect('/views/admin.ejs');
            } else {
                res.redirect('/homepage/homepage.html');
            }
        } else {
            return res.status(401).send('Credentials do not match');
        }
    } catch (error) {
        console.error("Error in Server:", error);
        return res.status(500).json({ message: 'Something went wrong with the server' });
    }
});

app.get('/check-login-status', (req, res) => {
    const sessionToken = req.cookies.sessionToken;
    if (sessionToken) {
        const user = req.session.user;
        res.json({ loggedIn: true, userName: user.name, userId: user._id });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get('/check_session', isLoggedIn, async (req, res) => {
    try {
      const user = await User.findById(req.session.user._id).populate('cart');
      res.json({ isAdmin: user.isAdmin });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

app.post("/sign_up", async (req, res) => {
    try {
        const { username: name, email, password } = req.body;
        await mongoose.connection.collection('userdetails').insertOne({ name, email, password, isAdmin: false});
        console.log("User registered:", name);
        res.redirect('/signup/signup.html');
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: 'Something went wrong with the server' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.sendStatus(500);
        }
        res.clearCookie('sessionToken');
        res.sendStatus(200);
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

// Hypothetical route handler for fetching reservations based on userName
app.get('/api/reservations/:userName', async (req, res) => {
    const userName = req.params.userName;
    console.log(userName);

    try {
        const cursor = await mongoose.connection.collection('reservations').find({ userName: userName });
        const reservations = await cursor.toArray(); // Convert cursor to array

        if (!reservations || reservations.length === 0) {
            return res.status(404).json({ error: 'No reservations found' });
        }

        console.log('Reservations:', reservations); // Log reservations
        res.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get("/admin", async (req, res) => {
    try {
        const users = await Reservations.find();
        res.render('admin.ejs', { title: "Admin Dashboard", users: users, message: req.flash() });
        req.session.message = null;
    } catch (error) {
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});

// Render the index page with all users
app.get("/index", async (req, res) => {
    try {
        const users = await Reservations.find();
        res.render('index.ejs', { title: "Home page", users: users });
    } catch (error) {
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});

// Insert user into database
app.post('/add', async (req, res) => {
    try {
        const user = new Reservations({
            userName: req.body.name,
            emailAddress: req.body.email,
            date: req.body.date,
            time: req.body.time,
            tableNumbers: req.body.tableNumber,
        });
        
        await user.save();
        console.log('success');
        
        // Set the message variable in the session
        req.flash('success', 'User added successfully!');
       
        
        // Redirect to the home page after setting the message
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});

// Render the form to add users
app.get("/add", (req, res) => {
    res.render('add_users', { title: "Add users" });
});


// Edit a user
app.get("/edit/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Reservations.findById(id).exec(); // Use exec() to execute the query

        if (!user) {
            res.redirect("/");
        } else {
            res.render('edit_users', { title: "Edit user", user: user });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update user route
app.post("/update/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updatedUser = await Reservations.findByIdAndUpdate(id, {
            userName: req.body.name,
            emailAddress: req.body.email,
            date: req.body.date,
            time: req.body.time,
            tableNumbers: req.body.tableNumber,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found", type: "danger" });
        }

        req.session.message = {
            type: "success",
            message: "User updated successfully!",
        };
        res.redirect('/index');
    } catch (error) {
        res.status(500).json({ message: error.message, type: "danger" });
    }
});

// Delete user route
app.post("/delete/:id", async (req, res) => {
    let id = req.params.id;
    try {
        const deletedUser = await Reservations.findOneAndDelete({ _id: id });
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found", type: "danger" });
        }
        req.session.message = {
            type: "success",
            message: "User deleted successfully!",
        };
        res.redirect("/index");
    } catch (error) {
        res.status(500).json({ message: error.message, type: "danger" });
    }
});


// GET route to handle deletion confirmation
app.get("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Reservations.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found", type: "danger" });
        }

        res.render("delete_confirmation", { title: "Delete User", user: user });
    } catch (error) {
        res.status(500).json({ message: error.message, type: "danger" });
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
<<<<<<< HEAD
});
=======
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
>>>>>>> 80b55acc82e467dd6eb157ce5475ab261793510c
=======
});

module.exports = router;
>>>>>>> 29d0ff2dd5f2c68f5cac404ff119c8ea8281eb76
