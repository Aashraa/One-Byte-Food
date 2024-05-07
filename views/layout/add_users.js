// Get today's date in yyyy-mm-dd format
const today = new Date().toISOString().split('T')[0];
// Set the min attribute of the date input to today
document.getElementById('date').setAttribute('min', today);

// Function to check if a date is a Saturday
function isSaturday(date) {
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek === 6; // 6 represents Saturday (0 is Sunday, 1 is Monday, ..., 6 is Saturday)
}

// Get the date input element
const dateInput = document.getElementById('date');

// Disable Saturdays and style them with red color
dateInput.addEventListener('focus', function() {
    const allDates = document.querySelectorAll('input[type="date"]::-webkit-calendar-date, input[type="date"]::-moz-calendar-box');
    allDates.forEach(date => {
        if (isSaturday(date.getAttribute('data-value'))) {
            date.style.pointerEvents = 'none'; // Disable selection
            date.style.color = 'red'; // Style as red
        }
    });
});




const seats = document.querySelectorAll(".row .seat:not(.occupied)");
const seatContainer = document.querySelector(".seating-container");
const countElement = document.getElementById("count1");
const totalElement = document.getElementById("total1");

// Update the selected seats count and total price
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll(".row .seat.selected");
    const selectedSeatsCount = selectedSeats.length;

    // Determine the price based on the selected table subtitle
    let price = 0;
    const sectionContainers = document.querySelectorAll(".section");
    sectionContainers.forEach(container => {
        const subtitle = container.querySelector(".subtitle");
        const sectionSeats = container.querySelectorAll(".row .seat.selected");
        if (sectionSeats.length > 0) {
            if (subtitle.textContent === "For 2 to 4 Guests") {
                price = 599;
            } else if (subtitle.textContent === "For 5 to 8 Guests") {
                price = 899;
            } else if (subtitle.textContent === "For 9 to 12 Guests") {
                price = 1199;
            }
        }
    });

    const totalPrice = selectedSeatsCount * price;

    // Update the UI with the count and total price
    countElement.textContent = selectedSeatsCount;
    totalElement.textContent = totalPrice;

    // Save the selected seats to local storage
    saveSelectedSeats();
}

// Save the selected seats to local storage
function saveSelectedSeats() {
    const selectedSeats = document.querySelectorAll(".row .seat.selected");
    const seatsIndex = Array.from(selectedSeats).map(seat => [...seats].indexOf(seat));
    localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));
}

// Populate the UI with data from local storage
function populateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));

    if (selectedSeats && selectedSeats.length > 0) {
        seats.forEach((seat, index) => {
            if (selectedSeats.indexOf(index) > -1) {
                seat.classList.add("selected");
            }
        });
    }
}

// Event delegation for seat selection
seatContainer.addEventListener("click", function(e) {
    if (e.target.classList.contains("seat") && !e.target.classList.contains("occupied")) {
        e.target.classList.toggle("selected");
        updateSelectedCount();
    }
});

// Initialize the UI
populateUI();
updateSelectedCount(); // Added to ensure count and total are updated on page load





