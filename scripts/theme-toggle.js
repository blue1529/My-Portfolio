//Theme toggle
// Theme toggle - Fixed version
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme or system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Set initial theme
if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    enableDarkMode();
    themeToggle.checked = true; // Check the checkbox for dark mode
} else {
    enableLightMode();
    themeToggle.checked = false; // Uncheck for light mode
}

// Toggle theme on button click
themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        enableDarkMode();
    } else {
        enableLightMode();
    }
});

function enableDarkMode() {
    htmlElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
}

function enableLightMode() {
    htmlElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            enableDarkMode();
            themeToggle.checked = true;
        } else {
            enableLightMode();
            themeToggle.checked = false;
        }
    }
});