// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        
        if (window.innerWidth <= 768) {
            if (navMenu.style.display === 'flex') {
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '70px';
                navMenu.style.left = '0';
                navMenu.style.width = '100%';
                navMenu.style.background = '#003399';
                navMenu.style.padding = '20px';
                navMenu.style.boxShadow = '0 5px 10px rgba(0,0,0,0.3)';
                navMenu.style.zIndex = '999';
            }
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu after click
            if (window.innerWidth <= 768 && navMenu) {
                navMenu.style.display = 'none';
            }
        }
    });
});

// Animate stats on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const statNumbers = document.querySelectorAll('.stat-number');
statNumbers.forEach(stat => observer.observe(stat));

function animateNumbers(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasStar = text.includes('★');
    const hasPercent = text.includes('%');
    
    let number = parseInt(text.replace(/[^\d]/g, ''));
    
    if (isNaN(number)) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = number / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        let display = Math.floor(current).toString();
        if (hasPlus) display += '+';
        if (hasStar) display += '★';
        if (hasPercent) display += '%';
        if (text.includes('/')) display = text;
        
        element.textContent = display;
    }, duration / steps);
}

// Add scroll effect to header
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
});

// Feature cards hover effect enhancement
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.background = 'linear-gradient(135deg, #f0f7ff, #ffffff)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.background = 'white';
    });
});

// Form validation
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = contactForm.querySelector('#name').value;
        const email = contactForm.querySelector('#email').value;
        const message = contactForm.querySelector('#message').value;
        
        if (!name || !email || !message) {
            alert('Veuillez remplir tous les champs');
            return;
        }
        
        if (!validateEmail(email)) {
            alert('Veuillez entrer une adresse email valide');
            return;
        }
        
        alert('Merci pour votre message ! Nous vous répondrons bientôt.');
        contactForm.reset();
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Lazy loading images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    const images = document.querySelectorAll('img.lazy');
    images.forEach(img => imageObserver.observe(img));
}

// Console message
console.log('%c🙏 Moi Église TV', 'font-size: 20px; font-weight: bold; color: #003399;');
console.log('%cMerci de visiter notre site !', 'font-size: 14px; color: #666;');

/* ========================================
   SCRIPT POUR LE LECTEUR VIDÉO LIVE
   ======================================== */

// Charger HLS.js depuis CDN
const hlsScript = document.createElement('script');
hlsScript.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
hlsScript.onload = function() {
    console.log('HLS.js chargé avec succès');
    initLivePlayer();
};
document.head.appendChild(hlsScript);

// Initialiser le lecteur vidéo live
function initLivePlayer() {
    const video = document.getElementById('live-video');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const muteBtn = document.getElementById('mute-btn');
    const volumeControl = document.getElementById('volume-control');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const retryButton = document.getElementById('retry-button');
    const streamDuration = document.getElementById('stream-duration');
    
    if (!video) {
        console.log('Élément vidéo non trouvé');
        return;
    }
    
    let hls;
    let streamStartTime = Date.now();
    
    function startPlayer() {
        if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            
            hls.loadSource('https://terranoweb.duckdns.org/live/MoiEgliseTV/index.m3u8');
            hls.attachMedia(video);
            
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                console.log('Stream prêt');
                if (loadingMessage) {
                    loadingMessage.style.display = 'none';
                }
                video.play().catch(e => {
                    console.log('Lecture automatique empêchée:', e);
                });
            });
            
            hls.on(Hls.Events.ERROR, function(event, data) {
                if (data.fatal) {
                    console.error('Erreur HLS:', data);
                    showError();
                }
            });
        } 
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = 'https://terranoweb.duckdns.org/live/MoiEgliseTV/index.m3u8';
            video.addEventListener('loadedmetadata', function() {
                if (loadingMessage) {
                    loadingMessage.style.display = 'none';
                }
                video.play().catch(e => console.log('Lecture automatique empêchée:', e));
            });
        } else {
            console.error('HLS non supporté');
            showError();
        }
    }
    
    function showError() {
        if (loadingMessage) loadingMessage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'flex';
    }
    
    // Contrôle Play/Pause
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playPauseBtn.querySelector('.play-icon').style.display = 'none';
                playPauseBtn.querySelector('.pause-icon').style.display = 'inline';
            } else {
                video.pause();
                playPauseBtn.querySelector('.play-icon').style.display = 'inline';
                playPauseBtn.querySelector('.pause-icon').style.display = 'none';
            }
        });
    }
    
    // Contrôle Mute/Unmute
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            if (video.muted) {
                muteBtn.querySelector('.volume-on').style.display = 'none';
                muteBtn.querySelector('.volume-off').style.display = 'inline';
            } else {
                muteBtn.querySelector('.volume-on').style.display = 'inline';
                muteBtn.querySelector('.volume-off').style.display = 'none';
            }
        });
    }
    
    // Contrôle du volume
    if (volumeControl) {
        volumeControl.addEventListener('input', (e) => {
            video.volume = e.target.value / 100;
        });
    }
    
    // Plein écran
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.mozRequestFullScreen) {
                video.mozRequestFullScreen();
            }
        });
    }
    
    // Bouton réessayer
    if (retryButton) {
        retryButton.addEventListener('click', () => {
            if (errorMessage) errorMessage.style.display = 'none';
            if (loadingMessage) loadingMessage.style.display = 'flex';
            streamStartTime = Date.now();
            startPlayer();
        });
    }
    
    // Mettre à jour la durée du stream
    function updateStreamDuration() {
        const elapsed = Math.floor((Date.now() - streamStartTime) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        
        const display = hours > 0 
            ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            : `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (streamDuration) {
            streamDuration.textContent = display;
        }
    }
    
    // Démarrer le lecteur
    startPlayer();
    
    // Mettre à jour la durée toutes les secondes
    setInterval(updateStreamDuration, 1000);
}