// Get today's date in yyyy-mm-dd format
const today = new Date().toISOString().split('T')[0];
// Set the min attribute of the date input to today
document.getElementById('date').setAttribute('min', today);

console.log("Client script loaded.");

document.querySelector('.back-button').addEventListener('click', () => {
    history.back(); // Go back to the previous page
});

const seatContainer = document.querySelector(".seating-container");
const countElement = document.getElementById("count1");
const totalElement = document.getElementById("total1");

<<<<<<< HEAD
=======
// Disable seat selection interface initially
seatContainer.style.pointerEvents = "none";

>>>>>>> 80b55acc82e467dd6eb157ce5475ab261793510c
// Define seat prices
const prices = {
    "For 2 to 4 Guests": 599,
    "For 5 to 8 Guests": 899,
    "For 9 to 12 Guests": 1199
};

// WebSocket connection with server
const socket = io();

socket.on("connect", () => {
    console.log("Connected to server");
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

// Handle real-time reservation updates
socket.on("reservationUpdate", (data) => {
    console.log("Received reservation update:", data);
    // Update UI with new reservation data (if needed)
});

<<<<<<< HEAD
// Mark already reserved seats in red
=======
// Function to mark already reserved seats in red
>>>>>>> 80b55acc82e467dd6eb157ce5475ab261793510c
async function markReservedSeats() {
    try {
        const response = await fetch('/getReservedSeats');
        if (!response.ok) {
            throw new Error('Failed to fetch reserved seats');
        }
        const reservedSeats = await response.json();

        reservedSeats.forEach(seatNumber => {
            const seat = document.querySelector(`.seat[data-number="${seatNumber}"]`);
            if (seat) {
                seat.classList.add("occupied");
            }
        });

        console.log('Reserved seats marked:', reservedSeats);
    } catch (error) {
        console.error('Error fetching reserved seats:', error);
    }
}

<<<<<<< HEAD
=======

>>>>>>> 80b55acc82e467dd6eb157ce5475ab261793510c
// Update the selected seats count and total price
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll(".row .seat.selected");
    const selectedSeatsCount = selectedSeats.length;
    console.log("Selected seats count:", selectedSeatsCount);

    let totalPrice = 0;
    selectedSeats.forEach(seat => {
        const subtitle = seat.closest(".section").querySelector(".subtitle").textContent;
        totalPrice += prices[subtitle];
    });

    // Update the UI with the count and total price
    countElement.textContent = selectedSeatsCount;
    totalElement.textContent = totalPrice;

    // Save the new selected seats to local storage
    saveSelectedSeats(selectedSeats);
}

// Save the selected seats to local storage
function saveSelectedSeats(selectedSeats) {
    const seatNumbers = Array.from(selectedSeats).map(seat => seat.dataset.number);
    localStorage.setItem("selectedSeats", JSON.stringify(seatNumbers));
    console.log("Selected seats saved to local storage.");
}

// Function to clear local storage
function clearLocalStorage() {
    localStorage.removeItem("selectedSeats");
    console.log("Local storage cleared.");
<<<<<<< HEAD
=======

    // Clear UI selection
    document.querySelectorAll('.row .seat.selected').forEach(seat => {
        seat.classList.remove('selected');
    });
>>>>>>> 80b55acc82e467dd6eb157ce5475ab261793510c
}

// Populate the UI with data from local storage
function populateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));
    if (selectedSeats) {
        selectedSeats.forEach(seatNumber => {
            const seat = document.querySelector(`.seat[data-number="${seatNumber}"]`);
            if (seat) {
                seat.classList.add("selected");
            }
        });
    }
    console.log("UI populated with data from local storage.");
}

// Event delegation for seat selection
seatContainer.addEventListener("click", (e) => {
<<<<<<< HEAD
=======
    // Check if the date has been selected
    const selectedDate = document.getElementById('date').value.trim();
    if (!selectedDate) {
        alert("Please select a date first.");
        return;
    }

    // Continue with seat selection
>>>>>>> 80b55acc82e467dd6eb157ce5475ab261793510c
    if (e.target.classList.contains("seat") && !e.target.classList.contains("occupied")) {
        e.target.classList.toggle("selected");
        updateSelectedCount();
    }
});

// Initialize the UI
populateUI();
updateSelectedCount(); // Ensure count and total are updated on page load
markReservedSeats(); // Mark reserved seats in red

<<<<<<< HEAD
document.querySelector('#reserve-button').addEventListener('click', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const selectedSeats = document.querySelectorAll('.row .seat.selected');

=======
// Listen for changes in the date input and fetch reserved seats for that date
document.getElementById('date').addEventListener('change', async (e) => {
    const date = e.target.value.trim();

    // Clear local storage when date changes
    clearLocalStorage();

    // Enable seat selection interface
    seatContainer.style.pointerEvents = "auto";

    try {
        const response = await fetch(`/getReservedSeats?date=${date}`);
        if (!response.ok) {
            throw new Error('Failed to fetch reserved seats');
        }
        const reservedSeats = await response.json();

        // Clear previously marked reserved seats
        document.querySelectorAll('.seat.occupied').forEach(seat => {
            seat.classList.remove('occupied');
        });

        // Mark reserved seats for the selected date
        reservedSeats.forEach(seatNumber => {
            const seat = document.querySelector(`.seat[data-number="${seatNumber}"]`);
            if (seat) {
                seat.classList.add("occupied");
            }
        });

        console.log('Reserved seats marked for', date, ':', reservedSeats);
    } catch (error) {
        console.error('Error fetching reserved seats:', error);
    }
});

document.querySelector('#reserve-button').addEventListener('click', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const date = document.getElementById('date').value.trim();
    const time = document.getElementById('time').value.trim();
    const selectedSeats = document.querySelectorAll('.row .seat.selected');

    if (!name || !email || !date || !time || !selectedSeats.length) {
        alert("Please fill out all fields and select at least one seat.");
        return;
    }

>>>>>>> 80b55acc82e467dd6eb157ce5475ab261793510c
    if (!selectedSeats.length) {
        console.error("No seats selected. Please select at least one seat.");
        return;
    }

    const tableNumbers = Array.from(selectedSeats).map(seat => seat.dataset.number);

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Date:", date);
    console.log("Time:", time);
    console.log("Table Numbers:", tableNumbers);

    const data = {
        userName: name,
        emailAddress: email,
        date: date,
        time: time,
        tableNumbers: tableNumbers
    };

    try {
        const response = await fetch('/sendData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log("Data sent successfully");
<<<<<<< HEAD
            clearLocalStorage();
=======
            alert("Table has been reserved successfully")
            clearLocalStorage();
            window.location.href = '/homepage/homepage.html';
>>>>>>> 80b55acc82e467dd6eb157ce5475ab261793510c
        } else {
            console.error("Failed to send data");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

<<<<<<< HEAD
=======
// Listen for beforeunload event to clear local storage before page unload
window.addEventListener('beforeunload', clearLocalStorage);
>>>>>>> 80b55acc82e467dd6eb157ce5475ab261793510c
