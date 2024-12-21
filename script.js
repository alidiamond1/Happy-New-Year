window.onload = function() {
    // Canvas Setup with proper sizing
    var canvas = document.getElementById("confettiCanvas");
    var context = canvas.getContext("2d");
    
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '3';
        canvas.style.pointerEvents = 'none';
    }

    // Initial canvas setup
    var width, height;
    resizeCanvas();

    // Resize handler
    window.addEventListener('resize', resizeCanvas);

    // Enhanced Confetti Particle
    function ConfettiParticle() {
        this.reset = function() {
            this.x = Math.random() * width;
            this.y = Math.random() * height - height;
            this.r = Math.random() * 6 + 4;
            this.d = Math.random() * 20 + 10;
            this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
            this.tilt = Math.floor(Math.random() * 10) - 10;
            this.tiltAngleIncremental = (Math.random() * 0.07) + 0.05;
            this.tiltAngle = 0;
            this.speed = 1 + Math.random();
            this.shape = Math.floor(Math.random() * 3);
            this.opacity = 1;
        }

        this.reset();

        this.draw = function() {
            context.beginPath();
            context.lineWidth = this.r / 2;
            context.strokeStyle = this.color;
            context.fillStyle = this.color;
            context.globalAlpha = this.opacity;

            switch(this.shape) {
                case 0: // Circle
                    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
                    context.fill();
                    break;
                case 1: // Square
                    context.save();
                    context.translate(this.x, this.y);
                    context.rotate(this.tiltAngle);
                    context.fillRect(-this.r, -this.r, this.r * 2, this.r * 2);
                    context.restore();
                    break;
                default: // Line
                    context.moveTo(this.x + this.tilt + this.r / 3, this.y);
                    context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
                    context.stroke();
            }
            context.globalAlpha = 1;
        }

        this.update = function() {
            this.y += this.speed;
            this.tiltAngle += this.tiltAngleIncremental;
            this.tilt = Math.sin(this.tiltAngle) * 15;

            if (this.y > height) {
                this.reset();
            }
        }
    }

    // Create confetti particles
    var particles = [];
    for (var i = 0; i < 150; i++) {
        particles.push(new ConfettiParticle());
    }

    // Draw confetti
    function draw() {
        context.clearRect(0, 0, width, height);
        
        for (var i = 0; i < particles.length; i++) {
            particles[i].draw();
        }
        update();
    }

    // Update confetti positions
    function update() {
        for (var i = 0; i < particles.length; i++) {
            particles[i].update();
        }
    }

    // Enhanced Countdown Timer
    function updateCountdown() {
        const now = new Date().getTime();
        const newYear = new Date(new Date().getFullYear() + 1, 0, 1).getTime();
        const timeLeft = newYear - now;

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Animate number changes with smooth transitions
        animateValue('days', days);
        animateValue('hours', hours);
        animateValue('minutes', minutes);
        animateValue('seconds', seconds);

        // Add pulse effect when seconds change
        const secondsElement = document.getElementById('seconds');
        secondsElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            secondsElement.style.transform = 'scale(1)';
        }, 100);
    }

    // Smooth number animation
    function animateValue(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = String(value).padStart(2, '0');
        }
    }

    // Add interactive effects
    document.querySelectorAll('.time-block').forEach(block => {
        block.addEventListener('mouseover', () => {
            // Add more confetti on hover
            for (let i = 0; i < 5; i++) {
                particles.push(new ConfettiParticle());
            }
            
            // Remove excess particles to maintain performance
            if (particles.length > 200) {
                particles.splice(0, particles.length - 200);
            }
        });
    });

    // Add sparkle effect to year digits
    document.querySelectorAll('.year-digit').forEach(digit => {
        digit.addEventListener('mouseover', function() {
            this.style.textShadow = '0 0 20px #fff, 0 0 30px #f06595, 0 0 40px #f06595';
            setTimeout(() => {
                this.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
            }, 500);
        });
    });

    // Start animations
    (function animloop() {
        requestAnimationFrame(animloop);
        draw();
    })();

    // Update countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
};