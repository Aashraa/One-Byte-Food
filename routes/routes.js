const express = require('express');
const router = express.Router();
const User = require("../models/users");
const path = require('path');

// Render the admin page
router.get("/admin", async (req, res) => {
    try {
        const users = await User.find();
        res.render('admin.ejs', { title: "Admin Dashboard", users: users, message: req.flash() });
        req.session.message = null;
    } catch (error) {
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});

// Render the index page with all users
router.get("/index", async (req, res) => {
    try {
        const users = await User.find();
        res.render('index.ejs', { title: "Home page", users: users });
    } catch (error) {
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});



// Render the index page with all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.render('admin.ejs', { title: "Home page", users: users, message: req.flash() }); // Pass the users data and message to the view template
        req.session.message = null; // Clear the message after rendering
    } catch (error) {
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});


// Insert user into database
router.post('/add', async (req, res) => {
    try {
        const user = new User({
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


//Get all users route
router.get("/", (req, res) => {
    User.find().exec((err, users) => {
        if (err) {
            res.json({message:err.message});
    }else{
        res.render('index.ejs', { title: "Home page", users: users, });
    }
})
})


// Render the form to add users
router.get("/add", (req, res) => {
    res.render('add_users', { title: "Add users" });
});


// Edit a user
router.get("/edit/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).exec(); // Use exec() to execute the query

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
router.post("/update/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(id, {
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
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ message: error.message, type: "danger" });
    }
});

// Delete user route
router.post("/delete/:id", async (req, res) => {
    let id = req.params.id;
    try {
        const deletedUser = await User.findOneAndDelete({ _id: id });
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found", type: "danger" });
        }
        req.session.message = {
            type: "success",
            message: "User deleted successfully!",
        };
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ message: error.message, type: "danger" });
    }
});


// GET route to handle deletion confirmation
router.get("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found", type: "danger" });
        }

        res.render("delete_confirmation", { title: "Delete User", user: user });
    } catch (error) {
        res.status(500).json({ message: error.message, type: "danger" });
    }
});

module.exports = router;
