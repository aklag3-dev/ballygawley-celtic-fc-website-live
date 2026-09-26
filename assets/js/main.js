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
    const swiperContainer = document.querySelector('.announcement-swiper');
    if (!swiperContainer) {
      console.warn('Swiper container not found');
      return;
    }
    
    const swiper = new Swiper('.announcement-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 1.2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 1.5,
          spaceBetween: 30,
        },
      },
      a11y: {
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide',
      },
    });
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
