/**
 * Choice Aire — Steve Jobs-Grade Interaction Engine
 * Matches the 20-Panel High-Converting HVAC Blueprint
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initSolutionTabs();
  initFaqAccordion();
  initBookingDrawer();
  initConcierge();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. Header Sticky Elevation
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Menu Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (!toggle || !navMenu) return;

  toggle.addEventListener('click', () => {
    const isOpen = navMenu.style.display === 'flex';
    if (isOpen) {
      navMenu.style.display = 'none';
      toggle.classList.remove('active');
    } else {
      navMenu.style.display = 'flex';
      navMenu.style.flexDirection = 'column';
      navMenu.style.position = 'absolute';
      navMenu.style.top = '74px';
      navMenu.style.left = '0';
      navMenu.style.right = '0';
      navMenu.style.background = '#FFFFFF';
      navMenu.style.padding = '1.5rem 2rem';
      navMenu.style.borderBottom = '1px solid #E5E7EB';
      navMenu.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.1)';
      toggle.classList.add('active');
    }
  });

  // Close when clicking nav links
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navMenu.style.display = 'none';
        toggle.classList.remove('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Panel 3: Solution Category Switcher Tabs
   -------------------------------------------------------------------------- */
const solutionData = {
  repair: {
    title: 'Precision Diagnostics & Rapid Repairs',
    desc: 'From refrigerant leaks and dead capacitors to furnace ignition failures, our factory-trained specialists inspect every component to find the root cause and restore comfort quickly.',
    img: './assets/images/modern_heat_pump.jpg',
    serviceKey: 'ac-repair',
    checks: [
      'Same-day emergency response in Summit, Stark & Medina',
      'Transparent upfront quote before any work begins',
      '100% parts & labor warranty on all completed repairs'
    ]
  },
  installation: {
    title: 'Energy-Efficient System Replacements',
    desc: 'Upgrade to high-efficiency Bryant inverter heat pumps or gas furnaces. Cut your seasonal electric and gas utility usage by up to 55% while qualifying for $2,850 in instant rebates.',
    img: './assets/images/modern_heat_pump.jpg',
    serviceKey: 'ac-installation',
    checks: [
      'Top-tier Bryant Factory Authorized equipment',
      'Zero-down and 0% APR financing options available',
      'Full factory 10-year parts & equipment warranty'
    ]
  },
  maintenance: {
    title: '$89 Precision 26-Point Tune-Up & Safety Audit',
    desc: 'Seasonal preventative maintenance ensures maximum airflow, prevents unexpected freeze-ups, cleans critical coils, and verifies electrical amp draw and safety shutoffs.',
    img: './assets/images/technician.png',
    serviceKey: 'tune-up',
    checks: [
      'Comprehensive 26-point furnace and AC inspection',
      'Signature No-Breakdown seasonal guarantee',
      'Priority scheduling status for annual club members'
    ]
  },
  iaq: {
    title: 'Whole-Home Air Purification & Humidity Control',
    desc: 'Eliminate airborne allergens, bacteria, dust mites, and odors with whole-house MERV-16 hospital-grade filtration, active UV lamps, and automated steam humidifiers.',
    img: './assets/images/hero_home.jpg',
    serviceKey: 'general-estimate',
    checks: [
      '99.98% capture rate for airborne contaminants',
      'Relief for allergy and asthma sufferers',
      'Balanced humidity prevents dry winter skin & wood warping'
    ]
  },
  upgrade: {
    title: 'Smart Thermostats & Multi-Zone Inverters',
    desc: 'Take complete control of every room in your home. Smart variable-capacity compressors automatically ramp up or down to keep each living zone at your desired temperature.',
    img: './assets/images/modern_heat_pump.jpg',
    serviceKey: 'ac-installation',
    checks: [
      'Individual temperature control for bedrooms and living rooms',
      'Wi-Fi smartphone control and energy usage analytics',
      'Whisper-quiet decibel levels comparable to a library'
    ]
  }
};

function initSolutionTabs() {
  const tabsNav = document.getElementById('solutionTabsNav');
  if (!tabsNav) return;

  const tabButtons = tabsNav.querySelectorAll('.solution-tab-btn');
  const titleEl = document.getElementById('solutionTabTitle');
  const descEl = document.getElementById('solutionTabDesc');
  const imgEl = document.getElementById('solutionTabImg');
  const checklistEl = document.getElementById('solutionChecklist');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tabKey = btn.getAttribute('data-tab');
      const data = solutionData[tabKey];
      if (!data) return;

      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.desc;
      if (imgEl) imgEl.src = data.img;

      if (checklistEl) {
        checklistEl.innerHTML = data.checks.map(c => `
          <div class="solution-check-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            <span>${c}</span>
          </div>
        `).join('');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Panel 14: FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isAlreadyActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Panels 18 & 20: Booking Drawer & Modals
   -------------------------------------------------------------------------- */
function initBookingDrawer() {
  const drawer = document.getElementById('bookingDrawer');
  const overlay = document.getElementById('bookingOverlay');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const serviceSelect = document.getElementById('bookService');
  const bookingForm = document.getElementById('bookingForm');
  const successMsg = document.getElementById('bookingSuccessMsg');
  const openButtons = document.querySelectorAll('.open-booking-btn');

  if (!drawer || !overlay) return;

  const openDrawer = (serviceKey) => {
    if (serviceKey && serviceSelect) {
      // Find matching option or default
      const exists = Array.from(serviceSelect.options).some(opt => opt.value === serviceKey);
      if (exists) {
        serviceSelect.value = serviceKey;
      } else if (serviceKey === 'tune-up') {
        serviceSelect.value = 'tune-up';
      } else if (serviceKey.includes('install')) {
        serviceSelect.value = 'ac-installation';
      } else {
        serviceSelect.value = 'general-estimate';
      }
    }
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceVal = btn.getAttribute('data-service') || 'general-estimate';
      openDrawer(serviceVal);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitBookingBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Request...';
      }

      setTimeout(() => {
        if (successMsg) successMsg.style.display = 'block';
        if (submitBtn) {
          submitBtn.textContent = 'Confirmed!';
          submitBtn.style.background = 'var(--color-accent)';
        }

        setTimeout(() => {
          bookingForm.reset();
          if (successMsg) successMsg.style.display = 'none';
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Confirm Priority Dispatch';
            submitBtn.style.background = '';
          }
          closeDrawer();
        }, 2200);
      }, 700);
    });
  }
}

/* --------------------------------------------------------------------------
   6. Floating Concierge Widget Click
   -------------------------------------------------------------------------- */
function initConcierge() {
  const concierge = document.getElementById('conciergeWidget');
  if (!concierge) return;

  concierge.addEventListener('click', () => {
    const trigger = document.querySelector('.open-booking-btn');
    if (trigger) {
      trigger.click();
    }
  });
}

/* --------------------------------------------------------------------------
   7. Smooth Anchor Scrolling
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
