document.getElementById('mobile-menu-button').addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent this click from immediately triggering the outside click handler
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
    
    // Add/remove event listeners based on menu state
    if (!menu.classList.contains('hidden')) {
        // Menu is now open - add listeners
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('scroll', handleScrollClose);
    } else {
        // Menu is now closed - remove listeners
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('scroll', handleScrollClose);
    }
});

// Function to handle clicks outside the menu
function handleClickOutside(event) {
    const menu = document.getElementById('mobile-menu');
    const menuButton = document.getElementById('mobile-menu-button');
    
    // If click is outside both menu AND button, close the menu
    if (!menu.contains(event.target) && event.target !== menuButton) {
        menu.classList.add('hidden');
        // Clean up listeners
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('scroll', handleScrollClose);
    }
}

// Function to handle scrolling - close after 100px of scroll
let scrollPosition = 0;
let scrollMovement = 100; // Adjust this value as needed

function handleScrollClose() {
    const menu = document.getElementById('mobile-menu');
    
    if (!menu.classList.contains('hidden')) {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Calculate how much we've scrolled since menu opened
        const scrollDistance = Math.abs(currentScroll - scrollPosition);
        
        // If scrolled beyond threshold, close the menu
        if (scrollDistance >= scrollMovement) {
            menu.classList.add('hidden');
            // Clean up listeners
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('scroll', handleScrollClose);
        }
    }
}

// Initialize scroll position when page loads
document.addEventListener('DOMContentLoaded', function() {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
});

// Also reset scroll position when menu opens (alternative approach)
// You could add this inside the menu toggle click handler:
// if (!menu.classList.contains('hidden')) {
//     scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
// }

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenu.classList.add('hidden');
        }
    });
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

