// 1. Handle mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('nav-open');
    });
}

// 2. Smooth scroll for same-page anchors
const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => {
    link.addEventListener('click', evt => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        evt.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
            top,
            behavior: 'smooth'
        });
        // Close nav on mobile if open
        if (nav && nav.classList.contains('nav-open')) {
            nav.classList.remove('nav-open');
        }
    });
});

// 3. Automatically update Copyright Year
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// 4. Contact Form Handling (Web3Forms)
// 4. Contact Form Handling (Web3Forms)
// 4. Contact Form Handling (Web3Forms)
window.sendMail = function () {
    const contactForm = document.getElementById('deepnxt-contact-form');
    const submitButton = document.getElementById('form-submit-btn');

    // 1. Basic Validation check
    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    // 2. Visual feedback
    const originalBtnText = submitButton.innerText;
    submitButton.innerText = "Sending...";
    submitButton.disabled = true;

    // 3. Collect Data
    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    // 4. Send to Web3Forms
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
        .then(async (response) => {
            let result = await response.json();
            if (response.status == 200) {
                showFormToast(true);
                contactForm.reset();
            } else {
                alert(result.message || "Submission failed");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Network error. Please check your connection.");
        })
        .finally(() => {
            // Reset Button State
            submitButton.innerText = originalBtnText;
            submitButton.disabled = false;
        });
}

// Helper: Toast Notification
function showFormToast(isSuccess) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    // Optional: Change text based on success/fail
    toast.innerText = isSuccess ? "Message sent! We'll be in touch shortly." : "Error sending message.";

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
