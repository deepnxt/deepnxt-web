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
window.sendMail = function () {
    const contactForm = document.getElementById('deepnxt-contact-form');
    const submitButton = document.getElementById('form-submit-btn');

    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    const originalBtnText = submitButton.innerText;
    submitButton.innerText = "Sending...";
    submitButton.disabled = true;

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

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
            submitButton.innerText = originalBtnText;
            submitButton.disabled = false;
        });
}

// 5. Lead Magnet Form Handling
window.handleLeadMagnet = function () {
    const form = document.getElementById('lead-magnet-form');
    const nameInput = document.getElementById('lm-name');
    const emailInput = document.getElementById('lm-email');
    const companyInput = document.getElementById('lm-company');
    const btn = form.querySelector('.lead-magnet-btn');

    if (!nameInput.value || !nameInput.checkValidity()) {
        nameInput.reportValidity();
        return;
    }
    if (!emailInput.value || !emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
    }
    if (!companyInput.value || !companyInput.checkValidity()) {
        companyInput.reportValidity();
        return;
    }

    const originalText = btn.innerText;
    btn.innerText = "Sending...";
    btn.disabled = true;

    // Use FormData to include all hidden fields (access_key, subject, botcheck honeypot)
    const formData = new FormData(form);
    formData.set('name', nameInput.value);
    formData.set('email', emailInput.value);
    formData.set('company', companyInput.value);
    formData.set('message', 'Requested the Enterprise AI Transformation Guide (PDF) — Please follow up with the guide.');
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
        .then(async (response) => {
            if (response.status == 200) {
                showFormToast(true, "Thank you! We'll send the guide to your email shortly.");
                form.reset();
            } else {
                let result = await response.json();
                alert(result.message || "Submission failed. Please try again.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Network error. Please check your connection and try again.");
        })
        .finally(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        });
}

// 6. Exit Intent Popup Handling
window.handleExitPopupSubmit = function () {
    const emailInput = document.getElementById('exit-email');
    const companyInput = document.getElementById('exit-company');
    const btn = document.querySelector('#exit-popup-form .btn-primary');

    if (!emailInput.value || !emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
    }
    if (!companyInput.value || !companyInput.checkValidity()) {
        companyInput.reportValidity();
        return;
    }

    const originalText = btn.innerText;
    btn.innerText = "Sending...";
    btn.disabled = true;

    // Use FormData to include all hidden fields (access_key, subject, botcheck honeypot)
    const form = document.getElementById('exit-popup-form');
    const formData = new FormData(form);
    formData.set('email', emailInput.value);
    formData.set('company', companyInput.value);
    formData.set('message', 'Requested AI Guide via exit-intent popup — Please follow up with the guide.');
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
        .then(async (response) => {
            if (response.status == 200) {
                closeExitPopup();
                showFormToast(true, "Thank you! We'll send the guide to your email shortly.");
            } else {
                alert("Something went wrong. Please try again.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Network error. Please check your connection and try again.");
        })
        .finally(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        });
}

// Helper: Toast Notification (updated to accept custom message)
function showFormToast(isSuccess, customMessage) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    if (customMessage) {
        toast.innerText = customMessage;
    } else {
        toast.innerText = isSuccess ? "Message sent! We'll be in touch shortly." : "Error sending message.";
    }

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// 7. Floating CTA - Show after scrolling past hero
const floatingCTA = document.getElementById('floating-cta');
if (floatingCTA) {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    floatingCTA.classList.remove('visible');
                } else {
                    floatingCTA.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        observer.observe(heroSection);
    }
}

// 8. Exit Intent Popup
const exitPopup = document.getElementById('exit-popup');
const exitPopupClose = document.getElementById('exit-popup-close');
let exitIntentShown = false;

function showExitPopup() {
    if (exitIntentShown) return;
    if (sessionStorage.getItem('exitPopupShown')) return;

    exitPopup.classList.add('visible');
    exitIntentShown = true;
    sessionStorage.setItem('exitPopupShown', 'true');
}

function closeExitPopup() {
    exitPopup.classList.remove('visible');
}

if (exitPopup && exitPopupClose) {
    // Desktop: mouse leave event
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0) {
            showExitPopup();
        }
    });

    // Close button
    exitPopupClose.addEventListener('click', closeExitPopup);

    // Close on overlay click
    exitPopup.addEventListener('click', (e) => {
        if (e.target === exitPopup) {
            closeExitPopup();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && exitPopup.classList.contains('visible')) {
            closeExitPopup();
        }
    });
}

// 9. Scroll-based animations (Intersection Observer)
const animateOnScroll = document.querySelectorAll('.tile, .media-card, .why-item, .comparison-box, .lead-magnet-card');
if (animateOnScroll.length > 0) {
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animateOnScroll.forEach(el => scrollObserver.observe(el));
}
