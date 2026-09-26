document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initCarousel();
  initMobileNav();
  initSmoothScroll();
  initEmailObfuscation();
});

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Email obfuscation to prevent spam harvesting
function initEmailObfuscation() {
  const emailLinks = document.querySelectorAll('a[data-email]');
  emailLinks.forEach(link => {
    const email = link.getAttribute('data-email');
    const subject = link.getAttribute('data-subject') || '';
    const mailto = subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
    link.href = mailto;
  });
}

function initDarkMode() {
  const toggle = document.getElementById('darkModeToggle');
  const icon = toggle.querySelector('i');
  const stored = localStorage.getItem('bcfc-dark-mode');

  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }

  toggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('bcfc-dark-mode', isDark ? 'dark' : 'light');
    icon.classList.toggle('fa-moon', !isDark);
    icon.classList.toggle('fa-sun', isDark);
  });
}

function initCarousel() {
  try {
    const track = document.getElementById('carouselTrack');
    if (!track) {
      console.warn('Carousel track not found');
      return;
    }
    
    const slides = track.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const container = document.querySelector('.carousel-container');
    const liveRegion = document.getElementById('carouselLive');

    if (!slides.length || !container) {
      console.warn('Carousel elements not found');
      return;
    }

    let current = 0;
    let autoPlayTimer;
    const total = slides.length;
    const autoPlayDelay = 5000;

    function getSlideOffset(index) {
      const slide = slides[index];
      const slideWidth = slide.offsetWidth;
      const containerWidth = container.offsetWidth;
      const slideLeft = slide.offsetLeft;
      
      const containerCenter = containerWidth / 2;
      const slideCenter = slideLeft + slideWidth / 2;
      
      return slideCenter - containerCenter;
    }

    function goTo(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      current = index;
      const offset = getSlideOffset(current);
      track.style.transform = `translateX(-${offset}px)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
        dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
      slides.forEach((slide, i) => {
        slide.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
      });
      if (liveRegion) {
        liveRegion.textContent = `Slide ${current + 1} of ${total}: ${slides[current].dataset.title}`;
      }
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(next, autoPlayDelay);
    }

    function stopAutoPlay() {
      clearInterval(autoPlayTimer);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoPlay(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); startAutoPlay(); });
    });

    container.addEventListener('mouseenter', stopAutoPlay);
    container.addEventListener('mouseleave', startAutoPlay);
    container.addEventListener('focusin', stopAutoPlay);
    container.addEventListener('focusout', startAutoPlay);

    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
      }
      startAutoPlay();
    }, { passive: true });

    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prev(); startAutoPlay(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { next(); startAutoPlay(); e.preventDefault(); }
    });

    window.addEventListener('resize', debounce(() => { goTo(current); }, 250));

    goTo(0);
    startAutoPlay();
  } catch (error) {
    console.error('Carousel initialization failed:', error);
  }
}

function initMobileNav() {
  try {
    const toggle = document.getElementById('mobileNavToggle');
    const nav = document.getElementById('mobileNav');
    const closeBtn = document.getElementById('mobileNavClose');
    
    if (!toggle || !nav) {
      console.warn('Mobile nav elements not found');
      return;
    }
    
    const icon = toggle.querySelector('i');
    const links = nav.querySelectorAll('a');

    function openNav() {
      nav.classList.add('open');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      }
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      nav.classList.remove('open');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeNav);
    }

    links.forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        closeNav();
      }
    });
  } catch (error) {
    console.error('Mobile nav initialization failed:', error);
  }
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
