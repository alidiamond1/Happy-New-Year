document.addEventListener('DOMContentLoaded', function() {
    // Audio Elements
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('toggleMusic');
    let isMusicPlaying = false;

    // Resolution Elements
    const resolutionInput = document.getElementById('newResolution');
    const addResolutionBtn = document.getElementById('addResolution');
    const resolutionList = document.getElementById('resolutionList');

    // Load resolutions from localStorage
    function loadResolutions() {
        const savedResolutions = JSON.parse(localStorage.getItem('newYearResolutions')) || [];
        resolutionList.innerHTML = ''; // Clear current list
        savedResolutions.forEach(resolution => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check-circle"></i> ${resolution.text}`;
            if (resolution.completed) {
                li.classList.add('completed');
            }
            resolutionList.appendChild(li);
            
            // Add click to complete functionality
            li.addEventListener('click', () => {
                li.classList.toggle('completed');
                updateLocalStorage();
            });
        });
    }

    // Save resolutions to localStorage
    function updateLocalStorage() {
        const resolutions = Array.from(resolutionList.children).map(li => ({
            text: li.textContent.trim(),
            completed: li.classList.contains('completed')
        }));
        localStorage.setItem('newYearResolutions', JSON.stringify(resolutions));
    }

    // Add new resolution
    function addResolution() {
        const text = resolutionInput.value.trim();
        if (text) {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check-circle"></i> ${text}`;
            
            // Add initial style for animation
            li.style.opacity = '0';
            li.style.transform = 'translateX(-20px)';
            
            resolutionList.appendChild(li);
            
            // Trigger animation
            requestAnimationFrame(() => {
                li.style.transition = 'all 0.3s ease';
                li.style.opacity = '1';
                li.style.transform = 'translateX(0)';
            });

            resolutionInput.value = '';

            // Add click to complete functionality
            li.addEventListener('click', () => {
                li.classList.toggle('completed');
                updateLocalStorage();
            });

            // Save to localStorage
            updateLocalStorage();
        }
    }

    // Countdown Timer
    function updateCountdown() {
        const now = new Date().getTime();
        const newYear = new Date(new Date().getFullYear() + 1, 0, 1).getTime();
        const timeLeft = newYear - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            updateTimeBlock('days', days);
            updateTimeBlock('hours', hours);
            updateTimeBlock('minutes', minutes);
            updateTimeBlock('seconds', seconds);
        } else {
            // If we've reached the new year
            document.querySelectorAll('.countdown-value').forEach(el => {
                el.textContent = '00';
            });
        }
    }

    function updateTimeBlock(id, value) {
        const element = document.getElementById(id);
        if (element) {
            const currentValue = element.textContent;
            const newValue = String(value).padStart(2, '0');
            
            if (currentValue !== newValue) {
                // Add scale and color animation
                element.style.transform = 'scale(1.2)';
                element.style.color = '#ff69b4';
                
                // Update value
                element.textContent = newValue;
                
                // Reset animation
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                    element.style.color = 'white';
                }, 200);
            }
        }
    }

    // Audio Control
    musicToggle.addEventListener('click', () => {
        if (!isMusicPlaying) {
            backgroundMusic.play().then(() => {
                musicToggle.innerHTML = '<i class="fas fa-music"></i>';
                musicToggle.classList.add('active');
                isMusicPlaying = true;
            }).catch(error => {
                console.error('Music playback failed:', error);
                musicToggle.innerHTML = '<i class="fas fa-music-slash"></i>';
            });
        } else {
            backgroundMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-music-slash"></i>';
            musicToggle.classList.remove('active');
            isMusicPlaying = false;
        }
    });

    // Event Listeners
    addResolutionBtn.addEventListener('click', addResolution);
    resolutionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addResolution();
    });

    // Initialize
    loadResolutions();
    backgroundMusic.volume = 0.5;

    // Start countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000);
});