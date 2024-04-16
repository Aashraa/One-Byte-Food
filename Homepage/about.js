// Smooth scrolling when clicking on the "About Us" button in the navbar
document.querySelector('.navbar-about-us').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.about-us').scrollIntoView({
      behavior: 'smooth'
    });
  });