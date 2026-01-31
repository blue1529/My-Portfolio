// Enhanced Theme Toggle with localStorage
        const themeToggle = document.getElementById('theme-toggle');
        const themeSlider = document.getElementById('theme-slider');
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');
        const themeLabel = document.getElementById('theme-label');
        
        // Check for saved theme or system preference
        function getPreferredTheme() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme;
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        // Apply theme
        function applyTheme(theme) {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                themeSlider.style.transform = 'translateX(28px)';
                themeLabel.textContent = 'Dark';
                sunIcon.style.opacity = '0.5';
                moonIcon.style.opacity = '1';
                themeToggle.classList.remove('from-gray-300', 'to-gray-400');
                themeToggle.classList.add('from-gray-700', 'to-gray-600');
            } else {
                document.documentElement.classList.remove('dark');
                themeSlider.style.transform = 'translateX(0)';
                themeLabel.textContent = 'Light';
                sunIcon.style.opacity = '1';
                moonIcon.style.opacity = '0.5';
                themeToggle.classList.remove('from-gray-700', 'to-gray-600');
                themeToggle.classList.add('from-gray-300', 'to-gray-400');
            }
            localStorage.setItem('theme', theme);
        }
        
        // Initialize theme
        applyTheme(getPreferredTheme());
        
        // Toggle theme
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) { // Only if user hasn't set a preference
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
        
        // Step 1: Pre-fill the form from URL parameters
        document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const serviceParam = urlParams.get('service');
            const priceParam = urlParams.get('price');

            if (serviceParam) {
                const serviceSelect = document.getElementById('service');
                const decodedService = decodeURIComponent(serviceParam);
                for (let option of serviceSelect.options) {
                    if (option.value === decodedService) {
                        option.selected = true;
                        updatePriceDisplay();
                        break;
                    }
                }
            }
            if (priceParam) {
                document.getElementById('priceValue').textContent = priceParam;
            }
        });

        // Update price display when service changes
        document.getElementById('service').addEventListener('change', updatePriceDisplay);
        function updatePriceDisplay() {
            const serviceSelect = document.getElementById('service');
            const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
            const price = selectedOption.getAttribute('data-price');
            document.getElementById('priceValue').textContent = price;
        }

        // Step 2: Form validation and modal
        const form = document.getElementById('quoteForm');
        const modal = document.getElementById('validationModal');
        const modalMessage = document.getElementById('modalMessage');
        const modalClose = document.getElementById('modalClose');

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const requiredFields = form.querySelectorAll('[required]');
            let missingFields = [];
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    const label = field.previousElementSibling?.textContent || field.name;
                    missingFields.push(label.replace('*', '').trim());
                }
            });

            if (missingFields.length > 0) {
                modalMessage.textContent = `Please fill in the following required fields: ${missingFields.join(', ')}.`;
                modal.style.display = 'flex';
                return;
            }

            // Show submission options with animation
            document.getElementById('submissionOptions').classList.remove('hidden');
            form.style.opacity = '0.5';
            form.style.pointerEvents = 'none';
            document.getElementById('submissionOptions').scrollIntoView({ behavior: 'smooth' });
        });

        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Step 3: Enhanced Submission functions
        function formatData() {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const price = document.getElementById('priceValue').textContent;

            return `📋 NEW QUOTE REQUEST 📋
            
👤 Contact Information:
• Name: ${data.name}
• Email: ${data.email}
• Phone: ${data.phone || 'Not provided'}

💼 Service Details:
• Service: ${data.service}
• Estimated Price: $${price}+
• Budget Range: ${data.budget || 'Not specified'}
• Timeline: ${data.timeline || 'Flexible'}

🎨 Project Details:
• Description: ${data.description}
• Color Preferences: ${data.colors || 'Not specified'}
• Special Features: ${data.features || 'None specified'}

📅 Submitted: ${new Date().toLocaleString()}
🔗 Source: Quote Form
            `;
        }

        // Enhanced email function
        document.getElementById('emailBtn').addEventListener('click', () => {
            const subject = encodeURIComponent(`New Quote Request: ${document.getElementById('name').value} - ${document.getElementById('service').value}`);
            const body = encodeURIComponent(formatData());
            // Replace with your email address
            window.location.href = `mailto:newtonkalulu00@gmail.com?subject=${subject}&body=${body}`;
            showThankYou();
        });

        // Enhanced WhatsApp
        document.getElementById('whatsappBtn').addEventListener('click', () => {
            const text = encodeURIComponent(formatData());
            window.open(`https://wa.me/+265996893890?text=${text}`, '_blank');
            showThankYou();
        });

        // Enhanced Telegram
        document.getElementById('telegramBtn').addEventListener('click', () => {
            const text = encodeURIComponent(formatData());
            // Replace with your username or leave blank
            const username = '@newton_kalulu';
            window.open(`https://t.me/share/url?url=${encodeURIComponent('https://newtonkalulu.vercel.app')}&text=${text}`, '_blank');
            showThankYou();
        });

        // Enhanced Copy to Clipboard
        document.getElementById('copyBtn').addEventListener('click', () => {
            navigator.clipboard.writeText(formatData()).then(() => {
                // Show a temporary notification
                const btn = document.getElementById('copyBtn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
                btn.style.backgroundColor = '#10B981';
                btn.style.color = 'white';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 2000);
                
                showThankYou();
            });
        });

        // Enhanced Print
        document.getElementById('printBtn').addEventListener('click', () => {
            const printContent = `
                <html>
                <head>
                    <title>Quote Request Summary</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #3B82F6; }
                        .section { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                        .label { font-weight: bold; color: #555; }
                    </style>
                </head>
                <body>
                    <h1>📋 Quote Request Summary</h1>
                    <pre>${formatData()}</pre>
                    <p style="margin-top: 30px; color: #666; font-size: 12px;">
                        Generated on ${new Date().toLocaleString()}
                    </p>
                </body>
                </html>
            `;
            
            const printWindow = window.open('', '_blank');
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
            
            showThankYou();
        });

        // Show thank you message after submission
        function showThankYou() {
            // Hide submission options with animation
            document.getElementById('submissionOptions').style.opacity = '0';
            document.getElementById('submissionOptions').style.transition = 'opacity 0.5s';
            
            setTimeout(() => {
                document.getElementById('submissionOptions').classList.add('hidden');
                document.getElementById('submissionOptions').style.opacity = '1';
                
                // Show thank you message
                document.getElementById('thankYouMessage').classList.remove('hidden');
                document.getElementById('thankYouMessage').scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
        
        // Initialize price display
        updatePriceDisplay();