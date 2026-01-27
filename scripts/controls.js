// Control panel functionality
document.addEventListener('DOMContentLoaded', () => {
    // Wait a moment for the shader to initialize
    setTimeout(() => {
        setupControls();
    }, 500);
});

function setupControls() {
    const toggleBtn = document.getElementById('toggle-animation');
    const brightnessSlider = document.getElementById('brightness-slider');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            // This would toggle the animation in the shaderGradient instance
            // You'll need to make shaderGradient accessible globally
            if (window.shaderGradientInstance) {
                const isAnimating = window.shaderGradientInstance.toggleAnimation();
                toggleBtn.textContent = isAnimating ? 'Pause' : 'Play';
            }
        });
    }
    
    if (brightnessSlider) {
        brightnessSlider.addEventListener('input', (e) => {
            if (window.shaderGradientInstance) {
                window.shaderGradientInstance.setBrightness(parseFloat(e.target.value));
            }
        });
    }
}

// Make controls available globally
window.setupControls = setupControls;