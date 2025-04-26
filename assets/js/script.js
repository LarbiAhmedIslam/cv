/* ... (conserve tout le JavaScript existant jusqu'à la section GALLERY) ... */

// ===== GALLERY LIGHTBOX Adopt-Pets (avec bouton) =====
const galleryThumbs = document.querySelectorAll('.gallery-thumb');
const galleryModal = document.getElementById('galleryModal');
const galleryModalImg = document.getElementById('galleryModalImg');
const closeGalleryModal = document.getElementById('closeGalleryModal');
const galleryModalPrev = document.getElementById('galleryModalPrev');
const galleryModalNext = document.getElementById('galleryModalNext');
const openGalleryBtn = document.getElementById('openGalleryBtn');
let galleryCurrent = 0;

function showGalleryImg(idx) {
    if (idx >= galleryThumbs.length) {
        galleryCurrent = 0;
    } else if (idx < 0) {
        galleryCurrent = galleryThumbs.length - 1;
    } else {
        galleryCurrent = idx;
    }
    
    const img = galleryThumbs[galleryCurrent];
    galleryModalImg.src = img.dataset.full;
    galleryModalImg.alt = img.alt;
}

function openGallery() {
    galleryModal.classList.toggle('show');
    document.body.style.overflow = 'hidden';
    showGalleryImg(galleryCurrent);
}

function closeGallery() {
    galleryModal.classList.toggle('show');
    document.body.style.overflow = '';
    const gallerySection = document.getElementById('adoptPetsGallerySection');
    const openGalleryBtn = document.getElementById('openGalleryBtn');
    if (gallerySection && openGalleryBtn) {
        gallerySection.style.display = 'none';
        openGalleryBtn.style.display = 'inline-block';
    }
}

// Event listeners
if (openGalleryBtn) {
    openGalleryBtn.addEventListener('click', openGallery);
}

galleryThumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
        galleryCurrent = i;
        openGallery();
    });
});

closeGalleryModal.addEventListener('click', closeGallery);

galleryModalPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showGalleryImg(galleryCurrent - 1);
});

galleryModalNext.addEventListener('click', (e) => {
    e.stopPropagation();
    showGalleryImg(galleryCurrent + 1);
});

window.addEventListener('keydown', (e) => {
    if (galleryModal.classList.contains('show')) {
        if (e.key === 'Escape') {
            closeGallery();
        } else if (e.key === 'ArrowLeft') {
            showGalleryImg(galleryCurrent - 1);
        } else if (e.key === 'ArrowRight') {
            showGalleryImg(galleryCurrent + 1);
        }
    }
});

galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
        closeGallery();
        
    }
});

// GALERIE SLIDESHOW
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("demo");
    let captionText = document.getElementById("caption");
    
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
    captionText.innerHTML = dots[slideIndex-1].alt;
    
    // Défilement automatique toutes les 5 secondes
    setTimeout(() => {
        plusSlides(1);
    }, 5000);
}

// Pour le bouton "Voir les captures"
document.getElementById('openGalleryBtn')?.addEventListener('click', () => {
    const gallerySection = document.querySelector('.adopt-pets-gallery-section');
    gallerySection.scrollIntoView({ behavior: 'smooth' });
    currentSlide(1); // Commencer au premier slide
});

// =============== GALLERY LIGHTBOX ===============
(function() {
    const thumbs = document.querySelectorAll('.gallery-thumb');
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('galleryLightboxImg');
    const lightboxCaption = document.getElementById('galleryLightboxCaption');
    const closeBtn = document.getElementById('galleryLightboxClose');
    const prevBtn = document.getElementById('galleryLightboxPrev');
    const nextBtn = document.getElementById('galleryLightboxNext');
    let current = 0;

    if (!thumbs.length || !lightbox) return;

    function showLightbox(idx) {
        current = idx;
        const img = thumbs[current];
        lightboxImg.src = img.dataset.full;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.dataset.caption || img.alt;
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
        thumbs.forEach(t => t.classList.remove('active'));
        thumbs[current].classList.add('active');
    }
    function hideLightbox() {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
        thumbs.forEach(t => t.classList.remove('active'));
    }
    function showPrev() {
        showLightbox((current - 1 + thumbs.length) % thumbs.length);
    }
    function showNext() {
        showLightbox((current + 1) % thumbs.length);
    }
    thumbs.forEach((thumb, i) => {
        thumb.addEventListener('click', () => showLightbox(i));
    });
    closeBtn.addEventListener('click', hideLightbox);
    prevBtn.addEventListener('click', e => { e.stopPropagation(); showPrev(); });
    nextBtn.addEventListener('click', e => { e.stopPropagation(); showNext(); });
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) hideLightbox();
    });
    window.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('show')) return;
        if (e.key === 'Escape') hideLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
})();

// =============== LAZY LOADING IMAGES ===============
(function() {
    // Charger les images seulement quand elles sont visibles
    const lazyImages = document.querySelectorAll('img:not(.lazy-excluded)');
    
    if (!('IntersectionObserver' in window)) {
        // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
        return;
    }
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Ajouter classe pour l'animation de chargement
                img.classList.add('lazy-loading');
                
                // Si data-src existe, on charge l'image
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                
                // Quand l'image est chargée, on ajoute la classe pour l'animation
                img.onload = () => {
                    img.classList.remove('lazy-loading');
                    img.classList.add('lazy-loaded');
                };
                
                // On arrête d'observer cet élément
                observer.unobserve(img);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });
    
    lazyImages.forEach(img => {
        // Ajouter une classe pour le style par défaut
        img.classList.add('lazy-loading');
        
        // Observer l'image
        imageObserver.observe(img);
    });
})();

// =============== FORM VALIDATION ===============
(function() {
    const contactForm = document.querySelector('.contact-modern-form');
    if (!contactForm) return;
    
    // Messages d'erreur stylisés
    function showError(input, message) {
        const formControl = input.parentElement;
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.innerText = message;
        
        // Supprimer les messages d'erreur existants
        const existing = formControl.querySelector('.error-message');
        if (existing) formControl.removeChild(existing);
        
        formControl.appendChild(errorMsg);
        input.classList.add('input-error');
        
        // Animation shake
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
    }
    
    function showSuccess(input) {
        input.classList.remove('input-error');
        input.classList.add('input-success');
        
        // Supprimer les messages d'erreur
        const formControl = input.parentElement;
        const error = formControl.querySelector('.error-message');
        if (error) formControl.removeChild(error);
    }
    
    function getFieldName(input) {
        return input.placeholder;
    }
    
    function checkEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => document.body.removeChild(toast), 300);
            }, 3000);
        }, 100);
    }
    
    // Validation à la soumission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Récupérer tous les inputs et textarea
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (input.value.trim() === '') {
                showError(input, `${getFieldName(input)} est requis`);
                isValid = false;
            } else {
                if (input.type === 'email' && !checkEmail(input.value)) {
                    showError(input, 'Email non valide');
                    isValid = false;
                } else {
                    showSuccess(input);
                }
            }
        });
        
        if (isValid) {
            // Simuler l'envoi du formulaire
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Envoi...';
            
            setTimeout(() => {
                // Réinitialiser le formulaire
                contactForm.reset();
                inputs.forEach(input => input.classList.remove('input-success'));
                
                // Afficher le toast de succès
                showToast('Message envoyé avec succès!');
                
                // Restaurer le bouton
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1500);
        }
    });
    
    // Validation en temps réel (optionnelle)
    inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (input.value.trim() === '') {
                showError(input, `${getFieldName(input)} est requis`);
            } else {
                if (input.type === 'email' && !checkEmail(input.value)) {
                    showError(input, 'Email non valide');
                } else {
                    showSuccess(input);
                }
            }
        });
        
        // Enlever le style d'erreur lors de la saisie
        input.addEventListener('input', function() {
            if (input.value.trim() !== '') {
                input.classList.remove('input-error');
                
                // Supprimer le message d'erreur
                const formControl = input.parentElement;
                const error = formControl.querySelector('.error-message');
                if (error) formControl.removeChild(error);
            }
        });
    });
})();

// =============== DARK/LIGHT THEME CLEAN ===============
(function() {
    const themeButton = document.getElementById('theme-button');
    const darkTheme = 'dark-theme';
    const iconTheme = 'bx-sun';

    // Récupérer le thème précédemment sélectionné
    const selectedTheme = localStorage.getItem('selected-theme');
    const selectedIcon = localStorage.getItem('selected-icon');

    // Appliquer le thème sauvegardé si présent
    if (selectedTheme) {
        document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
        themeButton.classList[selectedIcon === 'bx-sun' ? 'add' : 'remove'](iconTheme);
    }

    // Basculement manuel du thème
    themeButton.addEventListener('click', () => {
        document.body.classList.toggle(darkTheme);
        themeButton.classList.toggle(iconTheme);
        localStorage.setItem('selected-theme', document.body.classList.contains(darkTheme) ? 'dark' : 'light');
        localStorage.setItem('selected-icon', themeButton.classList.contains(iconTheme) ? 'bx-sun' : 'bx-moon');
    });
})();

// =============== SCROLL REVEAL ANIMATION ===============
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 300,
    reset: false,
    mobile: true,
    useDelay: 'once'
});

// Définir les animations pour chaque élément
sr.reveal('.section__title', { distance: '20px' });
sr.reveal('.home__data', { origin: 'top' });
sr.reveal('.home__img', { origin: 'bottom', delay: 500 });
sr.reveal('.about__img', { origin: 'left', delay: 100 });
sr.reveal('.about__data', { origin: 'right', delay: 300 });
sr.reveal('.skills__container', { delay: 200 });
sr.reveal('.work__card', { interval: 200 });
sr.reveal('.gallery-thumb', { interval: 100, distance: '40px' });
sr.reveal('.contact-modern-info', { origin: 'left', delay: 200 });
sr.reveal('.contact-modern-form', { origin: 'right', delay: 300 });
sr.reveal('.contact-modern-item', { interval: 150 });
sr.reveal('.footer__container', { delay: 200, distance: '30px', origin: 'bottom' });
