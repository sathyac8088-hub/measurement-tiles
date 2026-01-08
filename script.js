document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('rsvp-form');
    const feedback = document.getElementById('feedback-message');
    const button = form.querySelector('.btn');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simple validation
        const name = document.getElementById('name').value.trim();
        if (!name) return;

        // Simulate API call/processing
        button.textContent = 'Sending...';
        button.disabled = true;

        setTimeout(() => {
            // Success state
            form.style.display = 'none';
            feedback.textContent = `Thank you, ${name}! We can't wait to see you there.`;
            feedback.classList.remove('hidden');

            // Add a little celebration effect (optional console log or basic JS animation logic could go here)
            console.log(`RSVP Received from ${name}`);
        }, 1500);
    });
});
