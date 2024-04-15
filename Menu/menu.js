
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