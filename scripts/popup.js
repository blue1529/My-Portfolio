        // Show the popup when page loads
// Show the popup 5 seconds after page loads
document.addEventListener('DOMContentLoaded', function() {
    let countdown = 5;
    const countdownElement = document.getElementById('countdown-number');
    const countdownContainer = document.getElementById('popup-countdown');
    const redirectPopup = document.getElementById('redirectPopup');
    let countdownInterval;
    
    // Only show countdown if elements exist
    if (countdownContainer && countdownElement) {
        countdownContainer.classList.remove('hidden');
        
        countdownInterval = setInterval(function() {
            countdown--;
            countdownElement.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                countdownContainer.classList.add('hidden');
            }
        }, 1000);
    }
    
    // Show popup after 5 seconds
    setTimeout(function() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        if (countdownContainer) {
            countdownContainer.classList.add('hidden');
        }
        if (redirectPopup) {
            redirectPopup.style.display = 'flex';
        }
    }, 5000); // 5 seconds
});


        // Function to redirect user
        function redirectUser() {
            // ⚠️ CHANGE THIS URL TO YOUR DESIRED DESTINATION ⚠️
            const redirectUrl = 'webdesigning.html#pricing-webdesign'; // Replace with your URL
            
            // Optional: Add a smooth transition before redirecting
            document.querySelector('.popup-content').style.opacity = '0';
            document.querySelector('.popup-content').style.transform = 'scale(0.9)';
            
            setTimeout(function() {
                window.location.href = redirectUrl;
            }, 300); // 0.3 second animation before redirect
        }
        
        // Function to close the popup
        function closePopup() {
            const popup = document.getElementById('redirectPopup');
            popup.style.opacity = '0';
            popup.style.transition = 'opacity 0.3s ease';
            
            setTimeout(function() {
                popup.style.display = 'none';
            }, 300); // Match the transition time
        }
        
        // Close popup when clicking outside the content (optional)
        document.getElementById('redirectPopup').addEventListener('click', function(e) {
            if (e.target === this) {
                closePopup();
            }
        });
        
        // Close with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closePopup();
            }
        });