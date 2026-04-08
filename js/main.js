// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Navbar scroll effect y Parallax
    const navbar = document.getElementById('navbar');
    const heroImg = document.querySelector('.hero-bg img');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Navbar
        if (scrolled > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Parallax Hero
        if (heroImg && scrolled < window.innerHeight) {
            heroImg.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
    });

    // Mobile menu toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if(mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('active');
            // Toggle icon if needed (handled by CSS or Lucide)
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileBtn.classList.remove('active');
            });
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animated counters
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000; // ms
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    stat.innerText = Math.ceil(current) + (target > 500 ? '+' : '');
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = target + (target > 500 ? '+' : '');
                }
            };
            updateCounter();
        });
    };

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme (Light by default)
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || 'light';
    
    // Set initial theme
    htmlElement.setAttribute('data-theme', initialTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Optional: Trigger any chart updates if needed
            if (typeof updateChartsTheme === 'function') {
                updateChartsTheme(newTheme);
            }
        });
    }

    // Intersection Observer for counters
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true;
            }
        }, { threshold: 0.5 });
        observer.observe(statsContainer);
    }

    // Formulario de Contacto: Captura de Datos Ocultos (Fecha, Hora, IP, Navegador)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const addHiddenField = (form, name, value) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        };

        // Capturar Fecha, Hora y Navegador locales al momento de abrir la página
        const now = new Date();
        addHiddenField(contactForm, 'Fecha_Local', now.toLocaleDateString('es-VE'));
        addHiddenField(contactForm, 'Hora_Local', now.toLocaleTimeString('es-VE'));
        addHiddenField(contactForm, 'Navegador', navigator.userAgent);

        // Capturar IP a través de un servicio público
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => {
                if (data && data.ip) {
                    addHiddenField(contactForm, 'Direccion_IP', data.ip);
                }
            })
            .catch(err => console.log('Fetch IP fallido o bloqueado por el navegador.'));

        // Evento GA4 para envío de formulario
        contactForm.addEventListener('submit', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'generate_lead', {
                    'event_category': 'Contacto',
                    'event_label': 'Formulario de Contacto Enviado'
                });
            }
        });
    }

    // Eventos GA4 adicionales (WhatsApp)
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'click_whatsapp', {
                    'event_category': 'Contacto',
                    'event_label': 'Boton Flotante WhatsApp'
                });
            }
        });
    }
});
