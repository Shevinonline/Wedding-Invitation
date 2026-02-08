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

    // Preloader Counter Logic
    const preloader = document.getElementById('preloader');
    const counterElement = document.getElementById('counter');

    if (counterElement && preloader) {
        // Start: 2018.12
        // End: 2026.07
        let currentYear = 2018;
        let currentMonth = 12;

        const endYear = 2026;
        const endMonth = 7;

        // Speed of counter (ms per update)
        const intervalTime = 30;

        const updateCounter = setInterval(() => {
            // Format month to 2 digits
            const formattedMonth = currentMonth < 10 ? `0${currentMonth}` : currentMonth;
            counterElement.textContent = `${currentYear}.${formattedMonth}`;

            // Check if reached end date
            if (currentYear === endYear && currentMonth === endMonth) {
                clearInterval(updateCounter);

                // Animation complete, hide preloader
                setTimeout(() => {
                    preloader.classList.add('hide');
                }, 800); // Pause briefly at final date before fading
            } else {
                // Increment date
                currentMonth++;
                if (currentMonth > 12) {
                    currentMonth = 1;
                    currentYear++;
                }
            }
        }, intervalTime);
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
                    // If using no-cors, response is opaque, so just assume success or check status if possible
                    alert('Thank you! Your RSVP has been sent.');
                    rsvpForm.reset();
                    button.innerText = 'Sent!';
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.disabled = false;
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Something went wrong. Please try again.');
                    button.innerHTML = originalText;
                    button.disabled = false;
                });
        });
    }
    // --- Audio Control for Background Video ---
    const audioBtn = document.getElementById('audio-control');
    const videoIframe = document.getElementById('hero-video-iframe');
    let isMuted = true;

    if (audioBtn && videoIframe) {
        audioBtn.addEventListener('click', () => {
            const iconMute = audioBtn.querySelector('.icon-mute');
            const iconUnmute = audioBtn.querySelector('.icon-unmute');
            const textSpan = audioBtn.querySelector('span');

            if (isMuted) {
                // Unmute
                videoIframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
                // Also ensure it's playing just in case
                videoIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');

                iconMute.style.display = 'none';
                iconUnmute.style.display = 'block';
                textSpan.innerText = 'Sound Off';
                isMuted = false;
            } else {
                // Mute
                videoIframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');

                iconMute.style.display = 'block';
                iconUnmute.style.display = 'none';
                textSpan.innerText = 'Sound On';
                isMuted = true;
            }
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


    // --- Falling Animation Logic ---
    function spawnFallingItem(imageSrc) {
        // Create container if not exists
        let container = document.getElementById('falling-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'falling-container';
            document.body.appendChild(container); // Append to body, not specific section
        }

        const item = document.createElement('img');
        item.src = imageSrc;
        item.classList.add('falling-lotus'); // Re-use same class for animation

        // Random Start Position
        const startLeft = Math.random() * 90 + 5; // 5% to 95%
        item.style.left = startLeft + '%';

        // Random Size
        const size = Math.random() * 30 + 30; // 30px to 60px
        item.style.width = size + 'px';

        // Random Duration
        const duration = Math.random() * 5 + 5; // 5s to 10s
        item.style.animationDuration = duration + 's';

        // Random Delay
        const delay = Math.random() * 2;
        item.style.animationDelay = delay + 's';

        container.appendChild(item);

        // Remove after animation
        setTimeout(() => {
            item.remove();
        }, (duration + delay) * 1000);
    }

    // Spawn Rose every 3 seconds
    setInterval(() => spawnFallingItem('pngtree-red-rose-clipart-isolate.png'), 3000);

    // Spawn Lotus every 5 seconds
    setInterval(() => spawnFallingItem('vibrant-lotus-flower-illustratio.png'), 5000);

    // Initial Spawns
    spawnFallingItem('pngtree-red-rose-clipart-isolate.png');
    spawnFallingItem('vibrant-lotus-flower-illustratio.png');
    // Initial Spawn
    spawnFallingLotus();

});
