// ============================
// HEADER SCROLL BEHAVIOR
// ============================
let lastScrollTop = 0;
const header = document.getElementById('main-header');
const scrollThreshold = 50;

function handleHeaderScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll <= 0) {
        header.classList.remove('hidden');
        header.classList.add('shadow-lg');
        return;
    }
    
    if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
        // Scrolling DOWN - hide header
        header.classList.add('hidden');
    } else {
        // Scrolling UP - show header
        header.classList.remove('hidden');
        header.classList.add('shadow-lg');
    }
    
    if (currentScroll <= scrollThreshold) {
        header.classList.remove('shadow-lg');
    }
    
    lastScrollTop = currentScroll;
}

function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('scroll', debounce(handleHeaderScroll));
