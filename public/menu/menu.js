<<<<<<< HEAD

const menuSections = document.querySelectorAll('.menu-section');
menuSections.forEach(section => {
    section.addEventListener('wheel', (e) => {
        e.preventDefault();
        section.scrollLeft += e.deltaY;
    });
});


=======
const menuSections = document.querySelectorAll('.menu-section');
menuSections.forEach(section => {
    section.addEventListener('wheel', (e) => {
        if (e.target.classList.contains('menu-item')) {
            e.stopPropagation();
        } else {
            e.preventDefault();
            const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY);
            if (!isHorizontalScroll) {
                section.scrollLeft += e.deltaY;
            }
        }
    });
});

>>>>>>> 80b55acc82e467dd6eb157ce5475ab261793510c
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('mouseover', () => {
        item.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    });
    item.addEventListener('mouseout', () => {
        item.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    });
});

<<<<<<< HEAD

=======
>>>>>>> 80b55acc82e467dd6eb157ce5475ab261793510c
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

