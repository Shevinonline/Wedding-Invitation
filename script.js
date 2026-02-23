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

        // Play Background Music
        if (bgMusic) {
            bgMusic.muted = false;
            bgMusic.play().then(() => {
                iconSoundOff.classList.add('hidden');
                iconSoundOn.classList.remove('hidden');
            }).catch(() => {
                // If browser blocks audio autoplay even after tap, reflect on icon
                iconSoundOn.classList.add('hidden');
                iconSoundOff.classList.remove('hidden');
            });
        }

        introVideo.addEventListener('ended', revealMainSite, { once: true });

        const safeDuration = introVideo.duration
            ? (introVideo.duration + 2) * 1000
            : 20000;
        setTimeout(revealMainSite, safeDuration);
    }

    if (tapPrompt) {
        tapPrompt.addEventListener('click', onTap, { once: true });
        tapPrompt.addEventListener('touchstart', onTap, { passive: true, once: true });
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

                    if (videoOverlay && gateVideo && thankYouSection) {
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

                            // Swap form for thank you
                            rsvpForm.classList.add('hidden');
                            thankYouSection.classList.remove('hidden');

                            // Scroll to the thank you section
                            thankYouSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, { once: true });
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
