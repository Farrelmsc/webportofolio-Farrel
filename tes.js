// Daftar semua section dalam urutan
const sections = ['home', 'about', 'projects', 'skills', 'contact'];

// Fungsi untuk mengupdate judul section
function updateCurrentSection(sectionId) {
    const currentSection = document.getElementById('current-section');
    const sectionName = sectionId.replace('#', '');
    currentSection.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
}

// Fungsi untuk animasi fade
function fadeInSection(sectionId) {
    // Sembunyikan semua section terlebih dahulu
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('fade-in');
    });

    // Tampilkan section yang aktif dengan animasi
    const targetSection = document.querySelector(sectionId);
    // Trigger reflow untuk memastikan animasi berjalan
    void targetSection.offsetWidth;
    targetSection.classList.add('fade-in');
}

// Event listener saat dokumen dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi fade in untuk section pertama
    fadeInSection('#home');

    // Event listener untuk link navigasi
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelectorAll('.nav-links a').forEach(link => 
                link.classList.remove('active')
            );
            
            this.classList.add('active');
            
            const sectionId = this.getAttribute('href');
            updateCurrentSection(sectionId);
            
            document.querySelector(sectionId).scrollIntoView({
                behavior: 'smooth'
            });

            // Trigger animasi fade
            fadeInSection(sectionId);
        });
    });

    // Event listener scroll
    let isScrolling = false;
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const sections = document.querySelectorAll('section');
                
                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                        const sectionId = '#' + section.id;
                        updateCurrentSection(sectionId);
                        fadeInSection(sectionId);
                        
                        document.querySelectorAll('.nav-links a').forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === sectionId) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
                
                isScrolling = false;
            });
            
            isScrolling = true;
        }
    });
});

// Tambahkan variabel untuk touch events
let touchStartX = 0;
let touchEndX = 0;

// Fungsi untuk menangani touch events
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
}

function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].clientX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50; // Minimal jarak swipe
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        const currentSection = document.getElementById('current-section').textContent.toLowerCase();
        let currentIndex = sections.indexOf(currentSection);
        
        if (swipeDistance > 0) {
            // Swipe kanan
            currentIndex = (currentIndex - 1 + sections.length) % sections.length;
        } else {
            // Swipe kiri
            currentIndex = (currentIndex + 1) % sections.length;
        }
        
        const nextSection = sections[currentIndex];
        const sectionId = '#' + nextSection;
        
        updateCurrentSection(sectionId);
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === sectionId) {
                link.classList.add('active');
            }
        });
        
        document.querySelector(sectionId).scrollIntoView({
            behavior: 'smooth'
        });
        
        fadeInSection(sectionId);
    }
}

// Tambahkan event listeners untuk touch
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchend', handleTouchEnd, false);

// Prevent default touch behavior untuk mencegah scroll yang tidak diinginkan
document.addEventListener('touchmove', function(e) {
    if (Math.abs(touchEndX - touchStartX) > 10) {
        e.preventDefault();
    }
}, { passive: false });