document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    // Navbar Scroll Effect - REMOVED
    /* 
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    */

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Video Intro Screen (shows immediately on load) ---
    const videoIntro = document.getElementById('video-intro');
    const tapPrompt = document.getElementById('tap-prompt');
    const introVideo = document.getElementById('intro-video');
    const videoCurtain = document.getElementById('video-curtain');

    // Lock scroll while video intro is showing
    document.body.style.overflow = 'hidden';

    // Show the video intro right away
    if (videoIntro) {
        videoIntro.classList.add('visible');
    }

    // After video ends → bloom curtain → reveal the main site
    function revealMainSite() {
        if (!videoCurtain || !videoIntro) return;

        videoCurtain.classList.add('bloom');

        // Slower initial pause to let the bloom expand nicely
        setTimeout(() => {
            videoIntro.classList.add('exit');
            document.body.style.overflow = '';

            // Faster removal for a snappy reveal
            setTimeout(() => {
                videoIntro.remove();
            }, 800);
        }, 1300);
    }

    // Audio Elements
    const bgMusic = document.getElementById('bg-music');
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    const iconSoundOn = document.querySelector('.icon-sound-on');
    const iconSoundOff = document.querySelector('.icon-sound-off');

    // Mute/Unmute Toggle Logic
    let isMusicPlaying = false; // Note: changes dynamically based on play state

    if (audioToggleBtn && bgMusic) {
        audioToggleBtn.addEventListener('click', () => {
            if (bgMusic.paused || bgMusic.muted) {
                // Play / Unmute
                bgMusic.muted = false;
                bgMusic.play().catch(e => console.log("Audio play blocked", e));
                iconSoundOff.classList.add('hidden');
                iconSoundOn.classList.remove('hidden');
            } else {
                // Pause / Mute
                bgMusic.pause(); // we can pause since it's background music
                iconSoundOn.classList.add('hidden');
                iconSoundOff.classList.remove('hidden');
            }
        });
    }

    // User taps "Tap to Open" → play video & music
    function onTap() {
        if (!introVideo || !tapPrompt) return;

        tapPrompt.classList.add('hidden');

        // Play video
        introVideo.muted = false;
        introVideo.volume = 1.0;
        introVideo.classList.add('playing');
        introVideo.play().catch(() => {
            introVideo.muted = true;
            introVideo.play();
        });

        // Play Background Music (Force synchronous on touch/click)
        if (bgMusic) {
            bgMusic.muted = false;
            bgMusic.volume = 1.0;
            const playPromise = bgMusic.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    iconSoundOff.classList.add('hidden');
                    iconSoundOn.classList.remove('hidden');
                }).catch(error => {
                    console.log("Audio autoplay prevented by mobile browser:", error);
                    // If browser blocks audio autoplay even after tap, reflect on icon
                    iconSoundOn.classList.add('hidden');
                    iconSoundOff.classList.remove('hidden');
                });
            }
        }

        introVideo.addEventListener('ended', revealMainSite, { once: true });

        const safeDuration = introVideo.duration
            ? (introVideo.duration + 2) * 1000
            : 20000;
        setTimeout(revealMainSite, safeDuration);
    }

    if (tapPrompt) {
        tapPrompt.addEventListener('click', onTap, { once: true });
        tapPrompt.addEventListener('touchstart', (e) => {
            e.preventDefault(); // prevents double-firing with click and explicitly signals user interaction
            onTap();
        }, { once: true });
    }



    // --- Wedding Countdown Timer ---
    const countdownDate = new Date("July 6, 2026 00:00:00").getTime();

    const daysElem = document.getElementById("days");
    const hoursElem = document.getElementById("hours");
    const minutesElem = document.getElementById("minutes");
    const secondsElem = document.getElementById("seconds");

    if (daysElem && hoursElem && minutesElem && secondsElem) {
        const updateTimer = setInterval(function () {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            // Calculations
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Update DOM with zero-padding
            daysElem.innerText = days; // Days usually don't need padding if > 99
            hoursElem.innerText = hours < 10 ? "0" + hours : hours;
            minutesElem.innerText = minutes < 10 ? "0" + minutes : minutes;
            secondsElem.innerText = seconds < 10 ? "0" + seconds : seconds;

            // If count down is finished
            if (distance < 0) {
                clearInterval(updateTimer);
                document.querySelector(".timer-container").innerHTML = "<div class='time-box' style='width:100%'><span>Happily Ever After!</span></div>";
            }
        }, 1000);
    }

    // RSVP Form Handling
    const rsvpForm = document.getElementById('rsvp-form');
    // REPLACE THIS URL WITH YOUR DEPLOYED GOOGLE APPS SCRIPT URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwZojxNPJvv6ZfbzdDy__062qpsldRGuiJ_tnS5mUXYL5YbqrjzMlKaGTX-DR_AwhGT/exec';

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const button = rsvpForm.querySelector('button');
            const originalText = button.innerHTML;

            // Gather Form Data
            const formData = new FormData(rsvpForm);
            const data = {};

            // Handle multiple checkboxes for 'diet' - REMOVED
            /*
            const dietValues = [];
            rsvpForm.querySelectorAll('input[name="diet"]:checked').forEach((checkbox) => {
                dietValues.push(checkbox.value);
            });
            */

            data.name = formData.get('name');
            data.email = formData.get('email');
            data.attendance = formData.get('attendance');
            data.guests = formData.get('guest-count');
            // data.diet = dietValues;
            // data.otherDiet = formData.get('other-diet');
            data.message = formData.get('message');

            // UI Loading State
            button.innerText = 'Sending...';
            button.disabled = true;

            // Send to Google Sheet
            if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
                alert('Please configure the Google Script URL in script.js first!');
                button.innerHTML = originalText;
                button.disabled = false;
                return;
            }

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                // mode: 'no-cors' // Use this if CORS issues arise, but error handling is limited
            })
                .then(response => {
                    // Start success transition
                    rsvpForm.reset();
                    button.innerText = 'Sent!';

                    const videoOverlay = document.getElementById('success-video-overlay');
                    const gateVideo = document.getElementById('gate-video');
                    const thankYouSection = document.getElementById('rsvp-thank-you');
                    const sorrySection = document.getElementById('rsvp-sorry');
                    const finalSection = data.attendance === 'no' ? (sorrySection || thankYouSection) : thankYouSection;

                    if (videoOverlay && gateVideo && finalSection) {
                        if (data.attendance === 'no') {
                            // Swap form for sorry section directly without video
                            rsvpForm.classList.add('hidden');
                            finalSection.classList.remove('hidden');
                            finalSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        } else {
                            // 1. Show the video overlay
                            videoOverlay.classList.remove('hidden');

                            // 2. Play the video
                            gateVideo.muted = false; // Optional depending on if it has audio
                            gateVideo.play().catch(e => {
                                // Autoplay block fallback
                                gateVideo.muted = true;
                                gateVideo.play();
                            });

                            // Lock scrolling
                            document.body.style.overflow = 'hidden';

                            // 3. Listen for video end to reveal Thank you card
                            gateVideo.addEventListener('ended', () => {
                                // Hide video overlay
                                videoOverlay.classList.add('hidden');
                                document.body.style.overflow = '';

                                // Swap form for thank you section
                                rsvpForm.classList.add('hidden');
                                finalSection.classList.remove('hidden');

                                // Scroll to the section
                                finalSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, { once: true });
                        }
                    } else {
                        // Fallback if elements not found
                        alert('Thank you! Your RSVP has been sent.');
                        setTimeout(() => {
                            button.innerHTML = originalText;
                            button.disabled = false;
                        }, 3000);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Something went wrong. Please try again.');
                    button.innerHTML = originalText;
                    button.disabled = false;
                });
        });
    }




    // --- Venue Image Slider Logic ---
    const slides = document.querySelectorAll('.venue-image.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const indicatorsContainer = document.getElementById('slider-indicators');

    if (slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideInterval;

        // Create Indicators
        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => {
                goToSlide(index);
                resetInterval();
            });
            indicatorsContainer.appendChild(indicator);
        });

        const indicators = document.querySelectorAll('.indicator');

        function updateSlide() {
            // Remove active class from all
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(ind => ind.classList.remove('active'));

            // Add active to current
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlide();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlide();
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSlide();
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        }

        // Event Listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });
        }

        // Start Auto Play
        slideInterval = setInterval(nextSlide, 5000);
    }




});

// --- Scroll Reveal Animation ---
const revealElements = document.querySelectorAll('.reveal');

if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// --- Antigravity Rose Petals & Lily System ---
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('petal-canvas');
    // Guard against missing canvas
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    let width, height;
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle Array
    const particles = [];
    // Reduce count on smaller screens for performance
    const isMobile = width < 768;
    const baseParticleCount = isMobile ? 20 : 35;

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            // If initial, spawn anywhere; if resetting, spawn near bottom
            this.y = initial ? Math.random() * height : height + 20;

            // 50% Pink Rose Petal, 50% White Lily Petal
            this.isPink = Math.random() > 0.5;
            this.isPetal = true; // All are petals now

            // Soft Blush Pink (#FDEFF2) or White (#FFFFFF)
            const opacity = 0.3 + Math.random() * 0.4; // 0.3 to 0.7
            this.color = this.isPink ? `rgba(253, 239, 242, ${opacity})` : `rgba(255, 255, 255, ${opacity})`;

            // Petal specific properties
            this.size = Math.random() * 8 + 4; // 4 to 12
            this.vy = -(Math.random() * 0.8 + 0.3); // Float up slowly (-0.3 to -1.1)
            this.vx = (Math.random() - 0.5) * 0.8; // Drift left/right (-0.4 to 0.4)
            this.swaySpeed = Math.random() * 0.02 + 0.01;
            this.swayAmount = Math.random() * 2 + 1;
            this.angle = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.05;
            this.swayOffset = Math.random() * Math.PI * 2;
        }

        update() {
            // Apply sway to petals
            if (this.isPetal) {
                this.swayOffset += this.swaySpeed;
                this.x += Math.sin(this.swayOffset) * this.swayAmount * 0.1 + this.vx;
                this.angle += this.rotationSpeed;
            } else {
                this.x += this.vx;
            }

            this.y += this.vy;

            // Reset when off screen (top, left, or right)
            if (this.y + this.size < -50 || this.x > width + 50 || this.x < -50) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.translate(this.x, this.y);

            if (this.isPetal) {
                // Draw elegant curved petal shape
                ctx.rotate(this.angle);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                // Quadratic curves to form an organic petal
                ctx.quadraticCurveTo(this.size, -this.size * 0.5, this.size * 1.5, 0);
                ctx.quadraticCurveTo(this.size, this.size * 0.5, 0, 0);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Initialize particles
    for (let i = 0; i < baseParticleCount; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
});
