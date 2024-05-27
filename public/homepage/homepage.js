document.addEventListener('DOMContentLoaded', function () {
  const accountLink = document.querySelector('.has-dropdown > a');
  const accountDropdown = document.querySelector('.dropdown');

  // Function to toggle dropdown
  function toggleDropdown() {
      accountDropdown.classList.toggle('active');
  }

  // Event listener for account link click
  accountLink.addEventListener('click', function (event) {
      event.preventDefault();
      toggleDropdown();
  });

  // Close dropdown when clicking outside
  window.addEventListener('click', function (event) {
      if (!event.target.matches('.has-dropdown > a')) {
          if (accountDropdown.classList.contains('active')) {
              toggleDropdown();
          }
      }
  });
});

// Function to get cookie value by name
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return cookieValue;
        }
    }
    return null;
}

// Handle logout button click event
document.getElementById('logout-button').addEventListener('click', () => {
    // Send a request to the server to destroy the session and clear the cookies
    fetch('/logout', {
        method: 'POST',
        credentials: 'include',
    })
    .then(() => {
        // Redirect to homepage
        window.location.href = '/';
    })
    .catch(error => {
        console.error('Error logging out:', error);
    });
});

// Function to send a request to the server to check if the user is logged in
function checkLoginStatus() {
    fetch('/check-login-status')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                const userNameElement = document.getElementById('user-name');
                userNameElement.textContent = `Hi, ${data.userName}!`;
                // User is logged in, show logout button
                document.getElementById('signup-button').style.display = 'none'; // Hide signup button
                document.getElementById('logout-button').style.display = 'inline'; // Show logout button
            } else {
                // User is not logged in, show signup button
                document.getElementById('signup-button').style.display = 'inline'; // Show signup button
                document.getElementById('logout-button').style.display = 'none'; // Hide logout button
            }

            // Check login status before allowing table reservation
            document.getElementById('reserve-table-btn').addEventListener('click', (e) => {
            e.preventDefault();
            if (!data.loggedIn) {
                window.location.href = '/signup/signup.html';
            } else {
                window.location.href = '../reservation/reservation.html';
            }
            });
        })
        .catch(error => {
            console.error('Error fetching check-login-status:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});

// JavaScript for rotating buttons
document.addEventListener('DOMContentLoaded', function () {
  const leftBtn = document.querySelector('.left-btn');
  const rightBtn = document.querySelector('.right-btn');

  leftBtn.addEventListener('click', rotateLeft);
  rightBtn.addEventListener('click', rotateRight);

  function rotateLeft() {
    document.querySelector('main').style.transform += 'rotate(-3deg)';
  }

  function rotateRight() {
    document.querySelector('main').style.transform += 'rotate(3deg)';
  }
});

// JavaScript to toggle the visibility of recommendation details
document.addEventListener('DOMContentLoaded', function() {
  const detailsBtn = document.querySelector('.details-btn');
  const recommendationDetails = document.querySelector('.recommendation-details');

  detailsBtn.addEventListener('click', function() {
      recommendationDetails.classList.toggle('show-details');
      if (recommendationDetails.classList.contains('show-details')) {
          detailsBtn.textContent = 'Hide Details';
      } else {
          detailsBtn.textContent = 'See Details';
      }
  });
});

// Countdown function
function countdown() {
    const eventDate = new Date('2024-05-30 18:00:00').getTime(); // Change to your event date and time
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance <= 0) {
            clearInterval(countdownInterval);
            document.querySelector('.days').innerText = 0;
            document.querySelector('.hours').innerText = 0;
            document.querySelector('.minutes').innerText = 0;
            document.querySelector('.seconds').innerText = 0;
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.querySelector('.days').innerText = days;
        document.querySelector('.hours').innerText = hours;
        document.querySelector('.minutes').innerText = minutes;
        document.querySelector('.seconds').innerText = seconds;
    }, 1000);
}

// Update countdown every second
setInterval(countdown, 1000);

// Initial call to display countdown immediately
countdown();

document.addEventListener('DOMContentLoaded', function() {
  const scrollLinks = document.querySelectorAll('.scroll-to');

  scrollLinks.forEach(function(scrollLink) {
      scrollLink.addEventListener('click', function(event) {
          event.preventDefault();
          const targetId = scrollLink.getAttribute('href');
          const targetPosition = document.querySelector(targetId).offsetTop;

          window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
          });
      });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const accountLink = document.querySelector('.has-dropdown > a');
  const accountDropdown = document.querySelector('.dropdown');

  // Function to toggle dropdown
  function toggleDropdown() {
      accountDropdown.classList.toggle('active');
  }

  // Event listener for account link click
  accountLink.addEventListener('click', function (event) {
      event.preventDefault();
      toggleDropdown();
  });

  // Close dropdown when clicking outside
  window.addEventListener('click', function (event) {
      if (!event.target.matches('.has-dropdown > a')) {
          if (accountDropdown.classList.contains('active')) {
              toggleDropdown();
          }
      }
  });

  // Check if user is logged in and display name in navigation bar
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    const user = JSON.parse(loggedInUser);
    const userNameElement = document.getElementById('user-name');
    userNameElement.textContent = `Hi, ${user.name}!`;
    console.log(userNameElement.textContent);

    // Add event listener to toggle the dropdown menu
    const dropdownMenu = document.querySelector('.dropdown-menu');
    userNameElement.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show');
    });
  }
});
