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

    // ========== Video Demo Modal ==========
    const videoModal = document.getElementById('videoModal');
    if (videoModal) {
        const videoPlayer = document.getElementById('videoModalPlayer');
        const videoTitleText = document.getElementById('videoModalTitleText');
        const videoCloseBtn = videoModal.querySelector('.video-modal-close');
        const videoBtns = document.querySelectorAll('.btn-project-video');

        function buildHash(videoSrc, videoTitle) {
            const params = new URLSearchParams();
            params.set('v', videoSrc);
            if (videoTitle) params.set('t', videoTitle);
            return '#video?' + params.toString();
        }
        function parseHash() {
            const h = window.location.hash || '';
            const idx = h.indexOf('?');
            if (idx === -1 || h.substring(0, idx) !== '#video') return null;
            const qs = h.substring(idx + 1);
            const params = new URLSearchParams(qs);
            const v = params.get('v');
            if (!v) return null;
            return { v: v, t: params.get('t') || 'Video Demo' };
        }
        function setHashState(videoSrc, videoTitle) {
            try {
                const target = videoSrc ? buildHash(videoSrc, videoTitle) : (window.location.pathname + window.location.search);
                history.replaceState(null, '', videoSrc ? buildHash(videoSrc, videoTitle) : window.location.pathname + window.location.search);
            } catch (e) {}
        }

        function openVideoModal(videoSrc, videoTitle, updateHash) {
            if (!videoSrc) return;
            videoTitleText.textContent = videoTitle || 'Video Demo';
            const sourceEl = videoPlayer.querySelector('source');
            sourceEl.src = videoSrc;
            videoPlayer.load();
            videoModal.classList.add('open');
            videoModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (updateHash !== false) setHashState(videoSrc, videoTitle || 'Video Demo');
            setTimeout(() => {
                videoPlayer.focus({ preventScroll: true });
                videoPlayer.play().catch(() => {});
            }, 200);
        }

        function closeVideoModal(clearHash) {
            try {
                videoPlayer.pause();
                videoPlayer.currentTime = 0;
            } catch (e) {}
            const sourceEl = videoPlayer.querySelector('source');
            if (sourceEl) {
                sourceEl.src = '';
            }
            videoPlayer.load();
            videoModal.classList.remove('open');
            videoModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (clearHash !== false) setHashState(null, null);
        }

        videoBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const src = btn.getAttribute('data-video-src');
                const title = btn.getAttribute('data-video-title');
                openVideoModal(src, title);
            });
        });

        const initFromHash = () => {
            if (videoModal.classList.contains('open')) return;
            const info = parseHash();
            if (info) openVideoModal(info.v, info.t, false);
        };
        setTimeout(initFromHash, 50);
        window.addEventListener('hashchange', () => {
            const info = parseHash();
            if (info) {
                if (!videoModal.classList.contains('open')) openVideoModal(info.v, info.t, false);
            } else {
                if (videoModal.classList.contains('open')) closeVideoModal(false);
            }
        });

        videoCloseBtn.addEventListener('click', closeVideoModal);
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeVideoModal();
        });

        /* ------- Video Player Controls (arrows, space, click seek) ------- */
        const SEEK_STEP = 5;

        videoPlayer.addEventListener('keydown', (e) => {
            const key = e.key;
            const isArrow = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key);
            if (key === ' ' || isArrow) {
                e.stopPropagation();
                e.preventDefault();
            }
            if (key === ' ') {
                if (videoPlayer.paused) videoPlayer.play().catch(() => {});
                else videoPlayer.pause();
            } else if (key === 'ArrowLeft') {
                videoPlayer.currentTime = Math.max(0, videoPlayer.currentTime - SEEK_STEP);
            } else if (key === 'ArrowRight') {
                videoPlayer.currentTime = Math.min(videoPlayer.duration || 0, videoPlayer.currentTime + SEEK_STEP);
            } else if (key === 'ArrowUp') {
                videoPlayer.volume = Math.min(1, videoPlayer.volume + 0.1);
            } else if (key === 'ArrowDown') {
                videoPlayer.volume = Math.max(0, videoPlayer.volume - 0.1);
            } else if (key === 'F' || key === 'f') {
                if (!document.fullscreenElement) {
                    videoPlayer.requestFullscreen?.().catch(() => {});
                } else {
                    document.exitFullscreen?.().catch(() => {});
                }
            } else if (key === 'M' || key === 'm') {
                videoPlayer.muted = !videoPlayer.muted;
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!videoModal.classList.contains('open')) return;

            const insideVideo = e.target === videoPlayer || videoPlayer.contains(e.target);

            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key) && !insideVideo) {
                const key = e.key;
                if (key === ' ') {
                    if (videoPlayer.paused) videoPlayer.play().catch(() => {});
                    else videoPlayer.pause();
                } else if (key === 'ArrowLeft') {
                    videoPlayer.currentTime = Math.max(0, videoPlayer.currentTime - SEEK_STEP);
                } else if (key === 'ArrowRight') {
                    videoPlayer.currentTime = Math.min(videoPlayer.duration || 0, videoPlayer.currentTime + SEEK_STEP);
                } else if (key === 'ArrowUp') {
                    videoPlayer.volume = Math.min(1, videoPlayer.volume + 0.1);
                } else if (key === 'ArrowDown') {
                    videoPlayer.volume = Math.max(0, videoPlayer.volume - 0.1);
                }
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            if (e.key === 'Escape') {
                closeVideoModal();
                e.stopPropagation();
            }
        }, true);

        /* ------- Custom Click + Drag Seek (zone-aware, preserves native controls) ------- */
        const DRAG_ZONE_MAX = 0.35;
        const NATIVE_BAR_MAX = 0.18;
        const CUSTOM_CLICK_MIN = 0.18;
        const CUSTOM_CLICK_MAX = 0.35;
        let isSeeking = false;
        let wasPlayingBeforeSeek = false;
        let seekMoved = false;
        let startedInNativeBar = false;

        function seekFromClientX(clientX) {
            if (!videoPlayer.duration || isNaN(videoPlayer.duration)) return;
            const rect = videoPlayer.getBoundingClientRect();
            let ratio = (clientX - rect.left) / rect.width;
            ratio = Math.min(1, Math.max(0, ratio));
            videoPlayer.currentTime = ratio * videoPlayer.duration;
        }

        function bottomRatio(clientY) {
            const rect = videoPlayer.getBoundingClientRect();
            return (rect.bottom - clientY) / rect.height;
        }
        function inDragZone(clientY) { return bottomRatio(clientY) <= DRAG_ZONE_MAX; }
        function inNativeBar(clientY) { return bottomRatio(clientY) <= NATIVE_BAR_MAX; }
        function inCustomClickZone(clientY) {
            const br = bottomRatio(clientY);
            return br > CUSTOM_CLICK_MIN && br <= CUSTOM_CLICK_MAX;
        }

        let mouseDownPos = null;

        videoPlayer.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            const inNative = inNativeBar(e.clientY);
            const inDrag = inDragZone(e.clientY);
            if (!inDrag) return;
            startedInNativeBar = inNative;
            if (inNative) return;
            e.preventDefault();
            e.stopPropagation();
            isSeeking = true;
            seekMoved = false;
            wasPlayingBeforeSeek = !videoPlayer.paused;
            if (wasPlayingBeforeSeek) videoPlayer.pause();
            mouseDownPos = { x: e.clientX, y: e.clientY };
            seekFromClientX(e.clientX);
            videoPlayer.classList.add('is-seeking');
        });

        document.addEventListener('mousemove', (e) => {
            if (!isSeeking) return;
            if (mouseDownPos) {
                const dx = Math.abs(e.clientX - mouseDownPos.x);
                const dy = Math.abs(e.clientY - mouseDownPos.y);
                if (dx > 3 || dy > 3) seekMoved = true;
            }
            seekFromClientX(e.clientX);
        }, true);

        document.addEventListener('mouseup', (e) => {
            if (!isSeeking) return;
            isSeeking = false;
            videoPlayer.classList.remove('is-seeking');
            seekFromClientX(e.clientX);
            mouseDownPos = null;
            startedInNativeBar = false;
            if (wasPlayingBeforeSeek) videoPlayer.play().catch(() => {});
        }, true);

        videoPlayer.addEventListener('click', (e) => {
            if (!inCustomClickZone(e.clientY)) return;
            if (!videoPlayer.duration || isNaN(videoPlayer.duration)) return;
            if (seekMoved) { seekMoved = false; return; }
            e.preventDefault();
            e.stopPropagation();
            seekFromClientX(e.clientX);
        }, true);

        /* ------- Touch Seek (mobile) ------- */
        function getTouchClientX(e) {
            return e.touches && e.touches[0] ? e.touches[0].clientX : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : 0);
        }

        videoPlayer.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            if (!touch || !inDragZone(touch.clientY)) return;
            if (inNativeBar(touch.clientY)) return;
            e.preventDefault();
            isSeeking = true;
            wasPlayingBeforeSeek = !videoPlayer.paused;
            if (wasPlayingBeforeSeek) videoPlayer.pause();
            seekFromClientX(touch.clientX);
            videoPlayer.classList.add('is-seeking');
        }, { passive: false });

        videoPlayer.addEventListener('touchmove', (e) => {
            if (!isSeeking) return;
            e.preventDefault();
            seekFromClientX(getTouchClientX(e));
        }, { passive: false });

        videoPlayer.addEventListener('touchend', (e) => {
            if (!isSeeking) return;
            isSeeking = false;
            videoPlayer.classList.remove('is-seeking');
            seekFromClientX(getTouchClientX(e));
            if (wasPlayingBeforeSeek) videoPlayer.play().catch(() => {});
        }, { passive: false });
    }
});