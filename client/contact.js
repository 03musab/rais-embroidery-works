document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form form');
    const submitBtn = document.querySelector('.btn-submit');

    // Determine API URL (Local vs Production)
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_URL = isLocal ? 'http://localhost:5000/api/contact' : 'https://your-deployed-api.com/api/contact';

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Message sent successfully! We will get back to you soon.');
                    contactForm.reset();
                } else {
                    alert(result.error || 'Failed to send message. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Network error. Please try again later.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});