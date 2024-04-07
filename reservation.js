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
