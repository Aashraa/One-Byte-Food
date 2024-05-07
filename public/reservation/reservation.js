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

// Mark already reserved seats in red
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
    if (e.target.classList.contains("seat") && !e.target.classList.contains("occupied")) {
        e.target.classList.toggle("selected");
        updateSelectedCount();
    }
});

// Initialize the UI
populateUI();
updateSelectedCount(); // Ensure count and total are updated on page load
markReservedSeats(); // Mark reserved seats in red

document.querySelector('#reserve-button').addEventListener('click', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const selectedSeats = document.querySelectorAll('.row .seat.selected');

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
            clearLocalStorage();
        } else {
            console.error("Failed to send data");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

