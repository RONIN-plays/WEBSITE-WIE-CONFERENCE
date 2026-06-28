/* ============================================
   WIE CONFERENCE — INTERACTIVE SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- 1. NAVBAR SCROLL EFFECT ----
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  // ---- 2. ACTIVE NAV LINK HIGHLIGHTING ----
  function highlightActiveNav() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }
  window.addEventListener('scroll', highlightActiveNav);

  // ---- 3. MOBILE MENU TOGGLE ----
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- 4. SMOOTH SCROLL FOR ANCHOR LINKS ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- 5. SCROLL REVEAL ANIMATIONS ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve to allow re-triggering if needed, but for perf we do:
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- 6. COUNTDOWN TIMER ----
  const conferenceDate = new Date('2026-12-10T09:00:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = conferenceDate - now;

    if (diff <= 0) {
      document.querySelectorAll('.countdown-value').forEach(el => el.textContent = '0');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minsEl = document.getElementById('countdown-minutes');
    const secsEl = document.getElementById('countdown-seconds');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---- 7. PARTICLE NETWORK CANVAS ----
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouseX = 0;
    let mouseY = 0;

    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '124, 58, 237' : '6, 182, 212';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x -= dx * force * 0.01;
          this.y -= dy * force * 0.01;
        }

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 150;

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawConnections();
      animationId = requestAnimationFrame(animate);
    }

    // Mouse tracking on hero
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    resizeCanvas();
    initParticles();
    animate();

    // Pause animation when not visible
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animationId) animate();
        } else {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      });
    });
    heroObserver.observe(canvas);
  }

  // ---- 8. MOBILE NAV OVERLAY CLOSE ON OUTSIDE CLICK ----
  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('open')) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  // ---- 9. FORM SUBMISSION HANDLER ----
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Show a simple confirmation
      const btn = contactForm.querySelector('.btn-primary');
      const origText = btn.innerHTML;
      btn.innerHTML = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #10B981, #06B6D4)';
      setTimeout(() => {
        btn.innerHTML = origText;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

});
