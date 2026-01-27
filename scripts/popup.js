        // Show the popup when page loads
        document.addEventListener('DOMContentLoaded', function() {
            // Show popup after a brief delay (you can remove this delay if you want)
            setTimeout(function() {
                document.getElementById('redirectPopup').style.display = 'flex';
            }, 500); // 0.5 second delay
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