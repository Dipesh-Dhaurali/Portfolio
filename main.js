/* ============================================
   Portfolio - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
    
    const apiMeta = document.querySelector('meta[name="api-base"]');
    const formTokenMeta = document.querySelector('meta[name="formsubmit-token"]');
    const configuredApiBase = apiMeta ? apiMeta.getAttribute('content').trim() : '';
    let API_BASE = '';
    const FORMSUBMIT_TOKEN = formTokenMeta ? formTokenMeta.getAttribute('content').trim() : '';
    if (configuredApiBase) {
        API_BASE = configuredApiBase.replace(/\/+$/, '');
    } else {
        const host = window.location.host;
        if (host === '127.0.0.1:3000' || host === 'localhost:3000') {
            API_BASE = 'http://127.0.0.1:5000';
        } else {
            API_BASE = '';
        }
    }

    // Hide loading spinner
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        setTimeout(() => {
            spinner.classList.add('hide');
            setTimeout(() => {
                spinner.style.display = 'none';
            }, 500);
        }, 800);
    }

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========== Typing Effect ==========
    const typedElement = document.querySelector('.typed-text');
    const roles = ['Web Developer.', 'Full Stack Developer.','PHP Developer.', 'Laravel Developer.','Django Developer.', 'Python Developer.'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typedElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typedElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    if (typedElement) {
        setTimeout(typeEffect, 500);
    }

    // ========== Navbar Active State on Scroll ==========
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 200; // Offset for navbar height and trigger
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = sectionId;
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        } else if (window.scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('.nav-link[href="#home"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // ========== Smooth Scroll for Nav Links ==========
    document.querySelectorAll('.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========== Animate Skill Bars on Scroll ==========
    // ========== Animate Skill Bars from 0% to Target Percentage ==========
    const skillBars = document.querySelectorAll('.progress-bar');
    let skillsAnimated = false;
    
    const animateSkills = () => {
        if (skillsAnimated) return;
        
        const triggerPoint = window.innerHeight - 100;
        const skillsSection = document.querySelector('#skills');
        
        if (skillsSection) {
            const sectionTop = skillsSection.getBoundingClientRect().top;
            
            if (sectionTop < triggerPoint) {
                skillBars.forEach(bar => {
                    // Get the target percentage from the style attribute
                    const targetWidth = bar.getAttribute('data-target') || bar.style.width;
                    if (targetWidth && targetWidth !== '0%') {
                        // Animate from 0 to target
                        bar.style.transition = 'width 1.2s ease-out';
                        bar.style.width = targetWidth;
                    }
                });
                skillsAnimated = true;
            }
        }
    };
    
    // Set initial width to 0% and store target values
    skillBars.forEach(bar => {
        const targetWidth = bar.style.width;
        if (targetWidth) {
            bar.setAttribute('data-target', targetWidth);
            bar.style.width = '0%';
        }
    });
    
    window.addEventListener('scroll', animateSkills);
    window.addEventListener('load', animateSkills);

    // ========== Contact Form Validation & Email ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const subjectInput = document.getElementById('contactSubject');
        const messageInput = document.getElementById('contactMessage');
        const statusEl = document.getElementById('contactStatus');

        function setError(input, message) {
            const feedback = input.parentElement.querySelector('.invalid-feedback');
            input.classList.add('is-invalid');
            if (feedback) {
                feedback.textContent = message;
            }
        }

        function clearError(input) {
            const feedback = input.parentElement.querySelector('.invalid-feedback');
            input.classList.remove('is-invalid');
            if (feedback) {
                feedback.textContent = '';
            }
        }

        function validateName(value) {
            const trimmed = value.trim();
            if (!trimmed) return 'Name is required.';
            return '';
        }

        function validateEmail(value) {
            const trimmed = value.trim().toLowerCase();
            if (!trimmed) return 'Email is required.';
            if (/\s/.test(trimmed)) return 'Email cannot contain spaces.';
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!pattern.test(trimmed)) return 'Please enter a valid email address.';
            return '';
        }

        function validateSubject(value) {
            const trimmed = value.trim();
            if (!trimmed) return 'Subject is required.';
            return '';
        }

        function validateMessage(value) {
            const trimmed = value.trim();
            if (!trimmed) return 'Message is required.';
            return '';
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            statusEl.textContent = '';
            statusEl.className = 'mt-3 small text-center';

            const nameVal = nameInput.value;
            const emailVal = emailInput.value.toLowerCase();
            const subjectVal = subjectInput.value;
            const messageVal = messageInput.value;

            let hasError = false;

            clearError(nameInput);
            const nameError = validateName(nameVal);
            if (nameError) {
                setError(nameInput, nameError);
                hasError = true;
            } else {
                nameInput.value = nameVal.trim();
            }

            clearError(emailInput);
            const emailError = validateEmail(emailVal);
            if (emailError) {
                setError(emailInput, emailError);
                hasError = true;
            } else {
                emailInput.value = emailVal.trim();
            }

            clearError(subjectInput);
            const subjectError = validateSubject(subjectVal);
            if (subjectError) {
                setError(subjectInput, subjectError);
                hasError = true;
            } else {
                subjectInput.value = subjectVal.trim();
            }

            clearError(messageInput);
            const messageError = validateMessage(messageVal);
            if (messageError) {
                setError(messageInput, messageError);
                hasError = true;
            } else {
                messageInput.value = messageVal.trim();
            }

            if (hasError) {
                statusEl.textContent = 'Please fix the highlighted fields and try again.';
                statusEl.classList.add('text-danger');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            const payload = {
                name: nameInput.value,
                email: emailInput.value,
                subject: subjectInput.value,
                message: messageInput.value
            };

            const formattedMessage = `Subject: ${subjectInput.value}

Dear Dipesh,

My name is ${nameInput.value}. ${messageInput.value}

Thank you.
Name: ${nameInput.value}
Email: ${emailInput.value}
`;

            function sendViaFormSubmit() {
                if (!FORMSUBMIT_TOKEN) {
                    throw new Error('API failed and no FormSubmit token configured');
                }
                return fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_TOKEN}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        _subject: `Portfolio Contact: ${subjectInput.value}`,
                        message: formattedMessage,
                        _replyto: emailInput.value
                    })
                }).then(function(response) {
                    if (!response.ok) {
                        throw new Error('FormSubmit request failed');
                    }
                    return response.json();
                });
            }

            fetch(`${API_BASE}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(function(data) {
                if (!data.ok) {
                    return sendViaFormSubmit().then(function() {
                        statusEl.textContent = 'Message sent successfully!';
                        statusEl.classList.add('text-success');
                        contactForm.reset();
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    });
                }
                statusEl.textContent = 'Message sent successfully! Thank you for reaching out!';
                statusEl.classList.add('text-success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            })
            .catch(function(error) {
                if (FORMSUBMIT_TOKEN) {
                    sendViaFormSubmit()
                    .then(function() {
                        statusEl.textContent = 'Message sent successfully!';
                        statusEl.classList.add('text-success');
                        contactForm.reset();
                    })
                    .catch(function(err2) {
                        statusEl.textContent = 'Failed to send message. Please try again later.';
                        statusEl.classList.add('text-danger');
                    })
                    .finally(function() {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    });
                    return;
                }
                statusEl.textContent = 'Failed to send message. Please try again later.';
                statusEl.classList.add('text-danger');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
        });
    }

    // ========== Navbar Background on Scroll ==========
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});