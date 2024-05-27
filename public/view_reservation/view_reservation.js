document.querySelector('.back-button').addEventListener('click', () => {
    history.back(); // Go back to the previous page
});

// Fetch login status and reservations
fetch('/check-login-status')
    .then(response => response.json())
    .then(data => {
        console.log('Login status response:', data); // Log login status response
        if (data.loggedIn) {
            const userId = data.userId;
            fetchReservations(userId)
                .then(reservations => {
                    console.log('Fetched reservations:', reservations); // Log fetched reservations
                    updateReservationsTable(reservations);
                })
                .catch(error => console.error('Error fetching reservations:', error));
        }
    })
    .catch(error => console.error('Error checking login status:', error));

// Fetch reservations for the logged-in user
const fetchReservations = async (userName) => {
    try {
        const response = await fetch(`/api/reservations/${userName}`);
        const reservations = await response.json();
        console.log('Reservations response:', reservations); // Log reservations response
        return reservations;
    } catch (error) {
        console.error('Error in fetchReservations:', error);
        return [];
    }
};

// Function to delete a reservation
const deleteReservation = async (userName, reservationId) => {
    try {
        const response = await fetch(`/api/reservations/${userName}/${reservationId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        console.log(`Reservation ${reservationId} deleted successfully`);
    } catch (error) {
        console.error('Error deleting reservation:', error);
    }
};

const updateReservationsTable = (reservations) => {
    const tbody = document.querySelector('#reservations-table tbody');
    tbody.innerHTML = ''; // Clear existing rows

    if (reservations.length === 0) {
        console.log('No reservations found'); // Log if no reservations
        return;
    }

    reservations.forEach((reservation) => {
        // Add a check for reservation object properties
        if (!reservation || !reservation.userName || !reservation.emailAddress || !reservation.date || !reservation.time) {
            console.error('Invalid reservation data:', reservation);
            return;
        }

        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = reservation.userName; // Use 'userName' instead of 'name'
        row.appendChild(nameCell);

        const emailCell = document.createElement('td');
        emailCell.textContent = reservation.emailAddress; // Use 'emailAddress' instead of 'email'
        row.appendChild(emailCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = reservation.date;
        row.appendChild(dateCell);

        const timeCell = document.createElement('td');
        timeCell.textContent = reservation.time;
        row.appendChild(timeCell);

        // Check if 'tableNumbers' property exists before accessing it
        const tableNumbers = reservation.tableNumbers || [];
        const tableNumberCell = document.createElement('td');
        tableNumberCell.textContent = tableNumbers.join(', '); // Join table numbers if available
        row.appendChild(tableNumberCell);

        const actionsCell = document.createElement('td');
        row.appendChild(actionsCell);

        const cancelButton = document.createElement('button');
        cancelButton.classList.add('cancel-btn');
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => {
            deleteReservation(reservation.userName, reservation._id).then(() => {
                fetchReservations(reservation.userName).then(reservations => {
                    updateReservationsTable(reservations);
                });
            });
        });
        actionsCell.appendChild(cancelButton);

        tbody.appendChild(row);

    });

    console.log('Table updated with reservations'); // Log after updating the table
};

// DOMContentLoaded to fetch reservations after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fetch('/check-login-status')
        .then(response => response.json())
        .then(data => {
            console.log('DOMContentLoaded login status response:', data); // Log login status on DOMContentLoaded
            if (data.loggedIn) {
                const userName = data.userName;
                fetchReservations(userName)
                    .then(reservations => {
                        console.log('DOMContentLoaded fetched reservations:', reservations); // Log reservations on DOMContentLoaded
                        updateReservationsTable(reservations);
                    })
                    .catch(error => console.error('DOMContentLoaded error fetching reservations:', error));
            }
        })
        .catch(error => console.error('DOMContentLoaded error checking login status:', error));
});
