const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const sign_in_btn2 = document.querySelector("#sign-in-btn2");
const sign_up_btn2 = document.querySelector("#sign-up-btn2");
sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});
sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});
sign_up_btn2.addEventListener("click", () => {
    container.classList.add("sign-up-mode2");
});
sign_in_btn2.addEventListener("click", () => {
    container.classList.remove("sign-up-mode2");
});

// JavaScript code for the back button functionality
document.querySelector('.back-button').addEventListener('click', function() {
    history.back(); // Go back to the previous page
});

// Define functions for email and password validation
const validateEmail = (email) => {
    // Regular expression for validating email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    // Regular expressions for password validation
    const lengthRegex = /.{8,}/; // At least 8 characters
    const lowercaseRegex = /[a-z]/; // At least one lowercase letter
    const uppercaseRegex = /[A-Z]/; // At least one uppercase letter
    const numberRegex = /\d/; // At least one digit

    return (
        lengthRegex.test(password) &&
        lowercaseRegex.test(password) &&
        uppercaseRegex.test(password) &&
        numberRegex.test(password)
    );
};

// Function to handle signup form submission
const handleSignup = async (event) => {
    event.preventDefault();

    // Get form data
    const username = document.querySelector('.sign-up-form input[name="username"]').value;
    const email = document.querySelector('.sign-up-form input[name="email"]').value;
    const password = document.querySelector('.sign-up-form input[name="password"]').value;

    // Validate email and password
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (!validatePassword(password)) {
        alert('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one digit.');
        return;
    }

    // Send form data to server
    try {
        const response = await fetch('/sign_up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            alert('Signup successful!');
            // Optionally, redirect the user to another page after successful signup
            window.location.href = '/homepage/homepage.html';
        } else {
            alert('Signup failed. Please try again later.');
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert('Signup failed. Please try again later.');
    }
};

// Add event listener to the signup form
document.querySelector('.sign-up-form').addEventListener('submit', handleSignup);

const handleLogin = async (event) => {
    event.preventDefault();

    // Get form data
    const email = document.querySelector('.sign-in-form input[name="email"]').value;
    const password = document.querySelector('.sign-in-form input[name="password"]').value;

    // Send form data to server
    try {
        const response = await fetch('/sign_in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            alert('Login successful!');
            // Login successful, redirect to homepage
            window.location.href = '/homepage/homepage.html';
        } else {
            const responseData = await response.json();
            if (responseData.message === 'User not found') {
                // User not found, show alert message
                alert('User not found');
                // Clear input fields
                document.querySelector('.sign-in-form input[name="email"]').value = '';
                document.querySelector('.sign-in-form input[name="password"]').value = '';
            } else {
                alert('Login in failed.');
            }
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('User not found');
    }
};

// Add event listener to the login form
document.querySelector('.sign-in-form').addEventListener('submit', handleLogin);
