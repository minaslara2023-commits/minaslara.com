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
    // Formulario de Contacto: Captura de Datos Ocultos (Fecha, Hora, IP, Navegador)
    const contactForms = document.querySelectorAll('.contact-form');
    contactForms.forEach(form => {
        const addHiddenField = (f, name, value) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            f.appendChild(input);
        };

        const now = new Date();
        addHiddenField(form, 'Fecha_Local', now.toLocaleDateString('es-VE'));
        addHiddenField(form, 'Hora_Local', now.toLocaleTimeString('es-VE'));
        addHiddenField(form, 'Navegador', navigator.userAgent);

        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => {
                if (data && data.ip) {
                    addHiddenField(form, 'Direccion_IP', data.ip);
                }
            })
            .catch(() => {});

        form.addEventListener('submit', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'generate_lead', {
                    'event_category': form.id === 'form-contrataciones' ? 'Contrataciones' : 'Contacto',
                    'event_label': form.id === 'form-contrataciones' ? 'Formulario Proveedor Enviado' : 'Formulario Contacto Enviado'
                });
            }
        });
    });

    // Formulario de Contrataciones Abiertas: Drag and drop & file list preview
    const contratacionesForm = document.getElementById('form-contrataciones');
    if (contratacionesForm) {
        const fileInput = contratacionesForm.querySelector('#recaudos_file');
        const dropzone = contratacionesForm.querySelector('#dropzone-recaudos');
        const fileListContainer = contratacionesForm.querySelector('#recaudos-file-list');

        if (fileInput && dropzone && fileListContainer) {
            const allowedExtensions = ['pdf', 'jpg', 'jpeg'];

            const updateFileList = () => {
                fileListContainer.innerHTML = '';
                const files = Array.from(fileInput.files);

                if (files.length === 0) {
                    return;
                }

                let invalidFiles = [];

                files.forEach(file => {
                    const ext = file.name.split('.').pop().toLowerCase();
                    if (!allowedExtensions.includes(ext)) {
                        invalidFiles.push(file.name);
                        return;
                    }

                    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-preview-item';
                    
                    const isPdf = ext === 'pdf';
                    const badgeClass = isPdf ? 'badge-pdf' : 'badge-jpg';

                    fileItem.innerHTML = `
                        <div class="file-info">
                            <span class="file-badge ${badgeClass}">${ext.toUpperCase()}</span>
                            <span class="file-name" title="${file.name}">${file.name}</span>
                            <span class="file-size">(${sizeMb} MB)</span>
                        </div>
                    `;
                    fileListContainer.appendChild(fileItem);
                });

                if (invalidFiles.length > 0) {
                    alert(`Formatos no permitidos detectados: ${invalidFiles.join(', ')}.\nPor favor adjunta únicamente archivos en formato PDF o JPG/JPEG.`);
                    fileInput.value = '';
                    fileListContainer.innerHTML = '';
                }

                if (window.lucide && typeof window.lucide.createIcons === 'function') {
                    window.lucide.createIcons();
                }
            };

            fileInput.addEventListener('change', updateFileList);

            ['dragenter', 'dragover'].forEach(eventName => {
                dropzone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropzone.classList.add('drag-over');
                });
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropzone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropzone.classList.remove('drag-over');
                });
            });

            dropzone.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                if (dt && dt.files && dt.files.length > 0) {
                    fileInput.files = dt.files;
                    updateFileList();
                }
            });
        }
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
