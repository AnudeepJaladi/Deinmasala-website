/* ============================================================
   DEIN MASALA – Main JavaScript
   ============================================================ */

/* ──────────────────────────────────────────────────────────
   FESTIVAL THEME ENGINE
   ──────────────────────────────────────────────────────────
   Change this ONE variable to switch the entire site theme.
   Options: 'default' | 'holi' | 'diwali' | 'eid' | 'navratri' | 'pongal'
   ──────────────────────────────────────────────────────────
*/
const ACTIVE_THEME = 'default';

/* Theme configuration map */
const THEMES = {
  default: {
    name: 'Standard',
    icon: '✨',
    bannerText: 'Willkommen bei Dein Masala – Ihr Indischer Lebensmittelmarkt · Schnelle Lieferung in ganz Deutschland',
    bodyClass: '',
  },
  holi: {
    name: 'Holi',
    icon: '🎨',
    bannerText: '🎨 Holi Mubarak! Feiern Sie das Fest der Farben mit exklusiven Holi-Angeboten bei Dein Masala! 🌈',
    bodyClass: 'theme-holi',
  },
  diwali: {
    name: 'Diwali',
    icon: '🪔',
    bannerText: '🪔 Shubh Diwali! Das Lichterfest mit herrlichen Diwali-Spezialitäten und Geschenken feiern! 🎆',
    bodyClass: 'theme-diwali',
  },
  eid: {
    name: 'Eid',
    icon: '🌙',
    bannerText: '🌙 Eid Mubarak! Wünscht Dein Masala Ihnen und Ihrer Familie ein gesegnetes Eid-ul-Fitr! ⭐',
    bodyClass: 'theme-eid',
  },
  navratri: {
    name: 'Navratri',
    icon: '💃',
    bannerText: '💃 Navratri Utsav! Neun Nächte des Feierns – Spezielle Angebote für das Navratri-Fest! 🪘',
    bodyClass: 'theme-navratri',
  },
  pongal: {
    name: 'Pongal',
    icon: '🌾',
    bannerText: '🌾 Pongal-O-Pongal! Das Erntedankfest feiern mit frischen Zutaten von Dein Masala! ☀️',
    bodyClass: 'theme-pongal',
  },
};

/* ── Apply Theme ── */
function applyTheme(themeKey) {
  const theme = THEMES[themeKey] || THEMES.default;
  const html = document.documentElement;

  // Set data-theme attribute (drives all CSS variables)
  html.setAttribute('data-theme', themeKey);

  // Update nav theme badge
  const themeIcon = document.getElementById('themeIcon');
  const themeNameNav = document.getElementById('themeNameNav');
  if (themeIcon) themeIcon.textContent = theme.icon;
  if (themeNameNav) themeNameNav.textContent = theme.name;

  // Update festival banner
  const bannerIcon1 = document.getElementById('festivalBannerIcon');
  const bannerText = document.getElementById('festivalBannerText');
  const bannerIcon2 = document.getElementById('festivalBannerIcon2');
  if (bannerIcon1) bannerIcon1.textContent = theme.icon;
  if (bannerText) bannerText.textContent = theme.bannerText;
  if (bannerIcon2) bannerIcon2.textContent = theme.icon;

  // Animate the page
  const overlay = document.getElementById('themeOverlay');
  if (overlay) {
    overlay.classList.add('active');
    setTimeout(() => overlay.classList.remove('active'), 400);
  }

  console.log(`[Dein Masala] Theme applied: ${theme.name} ${theme.icon}`);
}

/* ── Initialize Theme on DOM Load ── */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(ACTIVE_THEME);
  initHeroSlider();
  initCountdownTimer();
  initNavbar();
  initProductFilter();
  initReviewsCarousel();
  initScrollTop();
  initWishlist();
  initNewsletterForm();
  initSmoothScroll();
  initHamburger();
  injectThemeOverlay();
});

/* ──────────────────────────────────────────────────────────
   INJECT THEME OVERLAY (for transitions)
   ────────────────────────────────────────────────────────── */
function injectThemeOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'themeOverlay';
  overlay.className = 'theme-transition-overlay';
  document.body.appendChild(overlay);
}

/* ──────────────────────────────────────────────────────────
   HERO SLIDER
   ────────────────────────────────────────────────────────── */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  if (!slides.length) return;

  let current = 0;
  let autoTimer = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAuto();
      goTo(parseInt(dot.dataset.dot));
      startAuto();
    });
  });

  // Touch/swipe support for hero
  const heroEl = document.getElementById('hero');
  if (heroEl) {
    let touchStartX = 0;
    heroEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    heroEl.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { stopAuto(); goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
    }, { passive: true });
  }

  startAuto();
}

/* ──────────────────────────────────────────────────────────
   COUNTDOWN TIMER – Counts down to next Sunday midnight
   ────────────────────────────────────────────────────────── */
function initCountdownTimer() {
  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minsEl = document.getElementById('countMins');
  const secsEl = document.getElementById('countSecs');
  if (!daysEl) return;

  function getNextSunday() {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 6=Sat
    const daysUntilSunday = (7 - day) % 7 || 7;
    const target = new Date(now);
    target.setDate(now.getDate() + daysUntilSunday);
    target.setHours(0, 0, 0, 0);
    return target;
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now = Date.now();
    const target = getNextSunday().getTime();
    let diff = Math.max(0, target - now);

    const d = Math.floor(diff / 86400000);
    diff -= d * 86400000;
    const h = Math.floor(diff / 3600000);
    diff -= h * 3600000;
    const m = Math.floor(diff / 60000);
    diff -= m * 60000;
    const s = Math.floor(diff / 1000);

    animateNumChange(daysEl, pad(d));
    animateNumChange(hoursEl, pad(h));
    animateNumChange(minsEl, pad(m));
    animateNumChange(secsEl, pad(s));
  }

  function animateNumChange(el, newVal) {
    if (el.textContent !== newVal) {
      el.style.transform = 'translateY(-4px)';
      el.style.opacity = '0.5';
      setTimeout(() => {
        el.textContent = newVal;
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      }, 150);
    }
  }

  tick();
  setInterval(tick, 1000);
}

/* ──────────────────────────────────────────────────────────
   NAVBAR – Scroll behaviour
   ────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });
}

/* ──────────────────────────────────────────────────────────
   HAMBURGER MENU
   ────────────────────────────────────────────────────────── */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    // Animate bars
    const bars = hamburger.querySelectorAll('span');
    if (isOpen) {
      bars[0].style.transform = 'rotate(45deg) translateY(7px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(-45deg) translateY(-7px)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity = '';
      bars[2].style.transform = '';
    }
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  });
}

/* ──────────────────────────────────────────────────────────
   PRODUCT FILTER TABS
   ────────────────────────────────────────────────────────── */
function initProductFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.product-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInCard 0.3s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Inject keyframe if not present
  if (!document.getElementById('filterAnim')) {
    const style = document.createElement('style');
    style.id = 'filterAnim';
    style.textContent = '@keyframes fadeInCard { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }';
    document.head.appendChild(style);
  }
}

/* ──────────────────────────────────────────────────────────
   REVIEWS CAROUSEL
   ────────────────────────────────────────────────────────── */
function initReviewsCarousel() {
  const cards = document.querySelectorAll('.review-card');
  const dots = document.querySelectorAll('.rdot');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');
  if (!cards.length) return;

  let current = 0;
  let autoTimer = null;

  function goTo(index) {
    cards[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + cards.length) % cards.length;
    cards[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 6000); }
  function stopAuto() { clearInterval(autoTimer); }

  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAuto();
      goTo(parseInt(dot.dataset.rdot));
      startAuto();
    });
  });

  // Touch swipe
  const wrap = document.querySelector('.reviews-carousel');
  if (wrap) {
    let tx = 0;
    wrap.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend', e => {
      const diff = tx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { stopAuto(); goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
    }, { passive: true });
  }

  startAuto();
}

/* ──────────────────────────────────────────────────────────
   SCROLL TO TOP
   ────────────────────────────────────────────────────────── */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ──────────────────────────────────────────────────────────
   WISHLIST TOGGLE
   ────────────────────────────────────────────────────────── */
function initWishlist() {
  document.querySelectorAll('.product-wishlist').forEach(btn => {
    btn.addEventListener('click', function () {
      const isActive = this.classList.toggle('active');
      this.textContent = isActive ? '♥' : '♡';
      showToast(isActive ? 'Zur Wunschliste hinzugefügt ♥' : 'Von Wunschliste entfernt');
    });
  });
}

/* ──────────────────────────────────────────────────────────
   NEWSLETTER FORM
   ────────────────────────────────────────────────────────── */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const email = input?.value?.trim();
    if (email) {
      showToast('🎉 Danke! 10% Rabatt-Code wurde an ' + email + ' gesendet!');
      form.reset();
    }
  });
}

/* ──────────────────────────────────────────────────────────
   SMOOTH SCROLL for anchor links
   ────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ──────────────────────────────────────────────────────────
   TOAST NOTIFICATION
   ────────────────────────────────────────────────────────── */
function showToast(message, duration = 3000) {
  // Remove existing toast
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;

  // Inject toast styles if not present
  if (!document.getElementById('toastStyle')) {
    const style = document.createElement('style');
    style.id = 'toastStyle';
    style.textContent = `
      .toast-notification {
        position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%) translateY(20px);
        background: var(--bg-dark); color: var(--text-on-dark);
        padding: 12px 24px; border-radius: 12px; font-size: 0.88rem; font-weight: 500;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 9998; opacity: 0;
        transition: all 0.3s ease;
        max-width: 90vw; text-align: center;
        border: 1px solid rgba(255,255,255,0.1);
      }
      .toast-notification.show {
        opacity: 1; transform: translateX(-50%) translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ──────────────────────────────────────────────────────────
   ADD TO CART – Placeholder handler
   (Will be replaced by Shopify Buy Button embed codes)
   ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.shopify-embed-placeholder .btn, .shopify-btn-placeholder .btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const card = this.closest('.product-card, .deal-card');
      const name = card?.querySelector('.product-name, h3')?.textContent || 'Produkt';

      // Update cart count
      const cartCount = document.querySelector('.cart-count');
      if (cartCount) {
        const current = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = current + 1;
        cartCount.style.transform = 'scale(1.4)';
        setTimeout(() => cartCount.style.transform = '', 200);
      }

      showToast(`🛒 "${name}" wurde zum Warenkorb hinzugefügt!`);
    });
  });
});

/* ──────────────────────────────────────────────────────────
   INTERSECTION OBSERVER – Animate sections on scroll
   ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (!('IntersectionObserver' in window)) return;

  // Inject animation styles
  const style = document.createElement('style');
  style.textContent = `
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .animate-on-scroll.animated {
      opacity: 1;
      transform: translateY(0);
    }
    .animate-delay-1 { transition-delay: 0.1s; }
    .animate-delay-2 { transition-delay: 0.2s; }
    .animate-delay-3 { transition-delay: 0.3s; }
    .animate-delay-4 { transition-delay: 0.4s; }
  `;
  document.head.appendChild(style);

  // Add animation classes to elements
  document.querySelectorAll('.category-card').forEach((el, i) => {
    el.classList.add('animate-on-scroll', `animate-delay-${(i % 4) + 1}`);
  });
  document.querySelectorAll('.product-card').forEach((el, i) => {
    el.classList.add('animate-on-scroll', `animate-delay-${(i % 4) + 1}`);
  });
  document.querySelectorAll('.trust-item').forEach((el, i) => {
    el.classList.add('animate-on-scroll', `animate-delay-${i + 1}`);
  });
  document.querySelectorAll('.deal-card').forEach((el, i) => {
    el.classList.add('animate-on-scroll', `animate-delay-${i + 1}`);
  });
  document.querySelectorAll('.loyalty-step').forEach((el, i) => {
    el.classList.add('animate-on-scroll', `animate-delay-${i + 1}`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
});

/* ──────────────────────────────────────────────────────────
   CATEGORY CARD click handler
   ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      const productsSection = document.getElementById('bestsellers');
      if (productsSection) {
        // Scroll to products
        const offset = 80;
        const top = productsSection.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });

        // Filter to the matching tab
        setTimeout(() => {
          const tabs = document.querySelectorAll('.filter-tab');
          const matchTab = [...tabs].find(t => t.dataset.filter === category || (category === 'all' && t.dataset.filter === 'all'));
          if (matchTab) {
            matchTab.click();
          }
        }, 600);
      }
    });
  });
});

/* ──────────────────────────────────────────────────────────
   SHOPIFY BUY BUTTON INTEGRATION GUIDE
   ──────────────────────────────────────────────────────────
   To add Shopify Buy Buttons:
   1. In Shopify Admin → Sales Channels → Buy Button
   2. Create a Buy Button for each product
   3. Copy the embed code
   4. Replace the content inside each:
      <div class="shopify-embed-placeholder" data-product-id="PRODUCT_ID">
   5. With the Shopify embed script/button code

   The data-product-id attributes on each card:
   - garam-masala-mdh
   - kurkuma-powder
   - tilda-basmati-2kg
   - haldirams-aloo-bhujia
   - mtr-gulab-jamun
   - everest-chaat-masala
   - trs-toor-dal
   - lijjat-papad
   - kashmiri-chilli (deal card)
   - basmati-5kg (deal card)
   - mango-achar (deal card)
   ────────────────────────────────────────────────────────── */

/* ──────────────────────────────────────────────────────────
   UTILITY: Expose theme switcher globally
   (useful for testing themes in browser console)
   Usage: DeinMasala.setTheme('diwali')
   ────────────────────────────────────────────────────────── */
window.DeinMasala = {
  setTheme: (theme) => {
    if (!THEMES[theme]) {
      console.warn(`[Dein Masala] Unknown theme: "${theme}". Available: ${Object.keys(THEMES).join(', ')}`);
      return;
    }
    applyTheme(theme);
  },
  themes: Object.keys(THEMES),
  currentTheme: ACTIVE_THEME,
};

console.log(
  `%c🌶 Dein Masala %c– Theme: ${THEMES[ACTIVE_THEME]?.icon} ${THEMES[ACTIVE_THEME]?.name}\n` +
  `%cSwitch theme: DeinMasala.setTheme('diwali')\nAvailable: ${Object.keys(THEMES).join(', ')}`,
  'color: #E07B39; font-size: 14px; font-weight: bold;',
  'color: #D4A017; font-size: 14px;',
  'color: #888; font-size: 11px;'
);
