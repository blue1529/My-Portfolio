// Configuration - Will be overridden by Vercel environment variables
let SUPABASE_URL = '';
let SUPABASE_ANON_KEY = '';

// Test Supabase connection on load
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Contact form script loaded');
    
    // Collect additional data
    document.getElementById('userAgent').value = navigator.userAgent;
    document.getElementById('pageUrl').value = window.location.href;
    document.getElementById('timestamp').value = new Date().toISOString();
    
    // Try to get config from environment (Vercel will inject these)
    try {
        // In Vercel, these will be available as environment variables
       // ✅ Use this instead: Directly inject your credentials from Vercel
        SUPABASE_URL = 'https://hrakbswoslrvmosbwgcf.supabase.co'; // Replace with your URL
        SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyYWtic3dvc2xydm1vc2J3Z2NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MzIzODgsImV4cCI6MjA4NTMwODM4OH0.AcuX6_DlsriHXDN-mIqTqTOoheGK4fTBseVIe_rTF3A'; // Replace with your anon key

        
        // If still empty, try from meta tag (fallback for static hosting)
        if (!SUPABASE_URL) {
            const metaUrl = document.querySelector('meta[name="supabase-url"]');
            const metaKey = document.querySelector('meta[name="supabase-key"]');
            if (metaUrl) SUPABASE_URL = metaUrl.content;
            if (metaKey) SUPABASE_ANON_KEY = metaKey.content;
        }
        
        console.log('Supabase URL configured:', SUPABASE_URL ? 'Yes' : 'No');
        
        // Initialize form
        setupForm();
    } catch (error) {
        console.error('Configuration error:', error);
        showError('Form configuration error. Please check console.');
    }
});

// Initialize Supabase client
function initializeSupabase() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error('Missing Supabase configuration');
        return null;
    }
    
    try {
        // Create Supabase client
        let supabaseClient = null;
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client initialized');
        return supabaseClient;
    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        return null;
    }
}

// Get user's IP address
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.log('IP fetch failed, using fallback');
        return 'unknown';
    }
}

// Setup form event listener
function setupForm() {
    const form = document.getElementById('contactForm');
    if (!form) {
        console.error('Form not found!');
        return;
    }
    
    form.addEventListener('submit', handleSubmit);
    console.log('Form event listener added');
}

// Handle form submission
async function handleSubmit(event) {
    event.preventDefault();
    
    console.log('Form submission started');
    
    const submitButton = document.getElementById('submitButton');
    const buttonText = document.getElementById('buttonText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Check honeypot field for bots
    const honeypot = document.getElementById('website').value;
    if (honeypot) {
        console.log('Bot detected via honeypot');
        // Silently succeed to confuse bots
        showSuccess();
        form.reset();
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    buttonText.textContent = 'Sending...';
    loadingSpinner.classList.remove('hidden');
    
    try {
        // Collect form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            message: document.getElementById('message').value.trim(),
            user_agent: document.getElementById('userAgent').value,
            page_url: document.getElementById('pageUrl').value,
            submitted_at: document.getElementById('timestamp').value,
            user_ip: await getUserIP(),
            status: 'unread'
        };
        
        // Validate required fields
        if (!formData.name || !formData.email || !formData.message) {
            throw new Error('Please fill in all required fields');
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            throw new Error('Please enter a valid email address');
        }
        
        console.log('Form data validated, inserting into Supabase...');
        
        // Initialize Supabase
        const supabaseClient = initializeSupabase();
        if (!supabaseClient) {
            throw new Error('Database connection failed. Please try again later.');
        }
        
        // Insert into Supabase
        const { data, error } = await supabaseClient
            .from('contact_submissions')
            .insert([formData]);
        
        if (error) {
            console.error('Supabase insert error:', error);
            throw new Error(`Database error: ${error.message}`);
        }
        
        console.log('Insert successful:', data);
        
        // Send notification
        await sendNotification(formData);
        
        // Show success
        showSuccess();
        
        // Reset form
        document.getElementById('contactForm').reset();
        
    } catch (error) {
        console.error('Submission error:', error);
        showError(error.message);
    } finally {
        // Reset button state
        setTimeout(() => {
            submitButton.disabled = false;
            buttonText.textContent = 'Send Message';
            loadingSpinner.classList.add('hidden');
        }, 2000);
    }
}

// Show success message
function showSuccess() {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    successMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 5000);
}

// Show error message
function showError(message) {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    errorText.textContent = message || 'There was an error sending your message.';
    errorMessage.classList.remove('hidden');
    successMessage.classList.add('hidden');
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 10000);
}

// Send notification
async function sendNotification(formData) {
    try {
        const topic = 'portfolio-alerts';
        const message = `📧 New Contact: ${formData.name}\n📩 From: ${formData.email}\n💬 ${formData.message.substring(0, 100)}...`;

        fetch(`https://ntfy.sh/${topic}`, {
            method: 'POST',
            body: message,
            headers: {
                'Title': 'New Form Submission', 
                'Priority': 'urgent'
            }
        });
        console.log('ntfy.sh notification sent');
    } catch (error) {
        console.error('ntfy.sh notification failed:', error);
    }
}

//debugging window
if (typeof window !== 'undefined') {
    window.contactFormDebug = {
        testConnection: async function() {
            const client = initializeSupabase();
            if (!client) return 'No client';
            
            const { data, error } = await client
                .from('contact_submissions')
                .select('count', { count: 'exact', head: true });
            
            return error ? `Error: ${error.message}` : 'Connection successful';
        },
        showConfig: function() {
            return {
                url: SUPABASE_URL ? 'Configured' : 'Missing',
                key: SUPABASE_ANON_KEY ? 'Configured' : 'Missing'
            };
        }
    };
}
