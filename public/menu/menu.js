
const menuSections = document.querySelectorAll('.menu-section');
menuSections.forEach(section => {
    section.addEventListener('wheel', (e) => {
        e.preventDefault();
        section.scrollLeft += e.deltaY;
    });
});


const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('mouseover', () => {
        item.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    });
    item.addEventListener('mouseout', () => {
        item.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    });
});


document.addEventListener('DOMContentLoaded', function() {
    // Check if the referrer is the homepage
    const referrer = document.referrer;
    if (referrer.includes('../Homepage/homepage.html')) {
        // Create back button
        const backButton = document.createElement('a');
        backButton.setAttribute('href', '../Homepage/homepage.html');
        backButton.classList.add('back-button');
        backButton.textContent = 'Back to Homepage';

        // Append back button to header
        const header = document.querySelector('header');
        header.appendChild(backButton);
    }
});

