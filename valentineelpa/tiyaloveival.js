 // Fireworks Canvas
        const canvas = document.getElementById('fireworksCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particles = [];
        let autoLaunchInterval;

        const colors = ['#ff6b9d', '#ffd700', '#ff1493', '#ba55d3', '#00d4ff', '#fff'];

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.velocity = {
                    x: (Math.random() - 0.5) * 8,
                    y: (Math.random() - 0.5) * 8
                };
                this.alpha = 1;
                this.friction = 0.98;
                this.gravity = 0.1;
            }

            update() {
                this.velocity.x *= this.friction;
                this.velocity.y *= this.friction;
                this.velocity.y += this.gravity;
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                this.alpha -= 0.008;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.restore();
            }
        }

        function createFirework(x, y) {
            const particleCount = 100;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(x, y, color));
            }
        }

        function animate() {
            ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();

                if (particle.alpha <= 0) {
                    particles.splice(index, 1);
                }
            });

            requestAnimationFrame(animate);
        }

        function launchRandomFirework() {
            const x = Math.random() * canvas.width;
            const y = Math.random() * (canvas.height * 0.6);
            createFirework(x, y);
        }

        // Start fireworks when section is visible
        const fireworksObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!autoLaunchInterval) {
                        animate();
                        autoLaunchInterval = setInterval(launchRandomFirework, 800);
                    }
                } else {
                    if (autoLaunchInterval) {
                        clearInterval(autoLaunchInterval);
                        autoLaunchInterval = null;
                    }
                }
            });
        });

        fireworksObserver.observe(document.getElementById('fireworks'));

        // Click to create firework
        canvas.addEventListener('click', (e) => {
            createFirework(e.clientX, e.clientY);
        });

        // Scroll functions
        function scrollToSection(index) {
            const sections = document.querySelectorAll('section');
            sections[index].scrollIntoView({ behavior: 'smooth' });
        }

        // Update active dot and progress bar on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section');
            const dots = document.querySelectorAll('.nav-dot');
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            
            document.getElementById('progressBar').style.width = progress + '%';

            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    dots.forEach(dot => dot.classList.remove('active'));
                    dots[index].classList.add('active');
                }
            });

            // Show/hide back to top button
            const backToTop = document.getElementById('backToTop');
            if (window.scrollY > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        // Resize canvas on window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });