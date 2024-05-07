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
  const now = new Date().getTime();
  const distance = eventDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.querySelector('.days').innerText = days;
  document.querySelector('.hours').innerText = hours;
  document.querySelector('.minutes').innerText = minutes;
  document.querySelector('.seconds').innerText = seconds;
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
  const userNameElement = document.getElementById('user-name');

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
      userNameElement.textContent = `Welcome, ${user.name}!`;
      console.log(userNameElement.textContent);
  }
});
