/**
 * Choice Aire — Universal Multi-Page Application Logic
 * High-performance, zero-friction client-side interactivity
 * Steve Jobs-Grade Polish & Tactile Feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initQuoteDrawer();
  initTriageRouting();
  initRoiCalculator();
  initComparisonSlider();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. Header Sticky Effect
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navList = document.querySelector('.nav-list');
  if (!toggle || !navList) return;

  toggle.addEventListener('click', () => {
    navList.classList.toggle('mobile-open');
    const isOpen = navList.classList.contains('mobile-open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
}

/* --------------------------------------------------------------------------
   3. Universal Slide-out Quote & Dispatch Drawer
   -------------------------------------------------------------------------- */
function initQuoteDrawer() {
  const backdrop = document.querySelector('.drawer-backdrop');
  const drawer = document.querySelector('.slide-drawer');
  const openButtons = document.querySelectorAll('.open-drawer-btn, #quoteBtn');
  const closeButton = document.querySelector('.drawer-close');

  if (!backdrop || !drawer) return;

  const openDrawer = (serviceType) => {
    if (serviceType) {
      const select = document.getElementById('drawer-service-select');
      if (select) select.value = serviceType;
    }
    backdrop.classList.add('active');
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    backdrop.classList.remove('active');
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      openDrawer(service);
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeDrawer);
  }

  backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // Drawer Form Submission
  const form = document.getElementById('drawer-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Transmitting Priority Dispatch...';

      setTimeout(() => {
        form.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="width: 58px; height: 58px; background: rgba(2, 132, 199, 0.15); border: 1px solid #38bdf8; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto; color: #38bdf8; font-size: 1.6rem;">✓</div>
            <h3 style="color: #fff; margin-bottom: 0.5rem;">Dispatch Request Confirmed</h3>
            <p style="font-size: 0.96rem; color: #cbd5e1; margin-bottom: 1.5rem;">Your emergency request has been routed to our Akron Central Dispatcher. A master technician is reviewing your location.</p>
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); padding: 1.15rem; border-radius: 10px; font-size: 0.92rem; color: #fbbf24; font-weight: 700;">
              Estimated On-Site Arrival Window: 35-45 Minutes
            </div>
          </div>
        `;
      }, 1000);
    });
  }
}

/* --------------------------------------------------------------------------
   4. Hero Diagnostic Triage Pre-fill Routing
   -------------------------------------------------------------------------- */
function initTriageRouting() {
  const triageButtons = document.querySelectorAll('.triage-btn');
  const backdrop = document.querySelector('.drawer-backdrop');
  const drawer = document.querySelector('.slide-drawer');
  const select = document.getElementById('drawer-service-select');
  const notes = document.getElementById('drawer-notes');

  triageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const issue = btn.getAttribute('data-issue') || 'AC Emergency Diagnostic';
      if (select) select.value = 'emergency';
      if (notes) notes.value = `Issue reported: ${issue}`;
      if (backdrop && drawer) {
        backdrop.classList.add('active');
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive 10-Year Energy ROI & IRA Rebate Calculator
   -------------------------------------------------------------------------- */
function initRoiCalculator() {
  const ageSlider = document.getElementById('roi-age-slider');
  const billSlider = document.getElementById('roi-bill-slider');
  if (!ageSlider || !billSlider) return;

  const ageVal = document.getElementById('roi-age-val');
  const billVal = document.getElementById('roi-bill-val');
  const annualSavingsEl = document.getElementById('roi-annual-savings');
  const taxCreditEl = document.getElementById('roi-tax-credit');
  const tenYearTotalEl = document.getElementById('roi-10yr-total');

  const updateCalculations = () => {
    const age = parseInt(ageSlider.value, 10);
    const bill = parseInt(billSlider.value, 10);

    if (ageVal) ageVal.textContent = `${age} Years Old`;
    if (billVal) billVal.textContent = `$${bill}/mo`;

    // Calculation logic based on SEER degradation (older units run 8-10 SEER vs modern 20+ SEER)
    let efficiencyGain = 0.28;
    if (age >= 12 && age < 16) efficiencyGain = 0.38;
    else if (age >= 16) efficiencyGain = 0.52;

    const annualBill = bill * 12;
    const annualSavings = Math.round(annualBill * efficiencyGain);
    const federalTaxCredit = 2000; // IRA 25C max heat pump credit
    const tenYearTotal = (annualSavings * 10) + federalTaxCredit;

    if (annualSavingsEl) annualSavingsEl.textContent = `$${annualSavings.toLocaleString()}/yr`;
    if (taxCreditEl) taxCreditEl.textContent = `$${federalTaxCredit.toLocaleString()}`;
    if (tenYearTotalEl) tenYearTotalEl.textContent = `$${tenYearTotal.toLocaleString()}`;
  };

  ageSlider.addEventListener('input', updateCalculations);
  billSlider.addEventListener('input', updateCalculations);
  updateCalculations();
}

/* --------------------------------------------------------------------------
   6. Touch / Mouse Before & After Comparison Slider
   -------------------------------------------------------------------------- */
function initComparisonSlider() {
  const container = document.querySelector('.comparison-slider-box');
  const afterImgBox = document.querySelector('.comparison-after');
  const handle = document.querySelector('.comparison-slider-handle');

  if (!container || !afterImgBox || !handle) return;

  let isDragging = false;

  const moveSlider = (x) => {
    const rect = container.getBoundingClientRect();
    let posX = x - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;

    const percentage = (posX / rect.width) * 100;
    afterImgBox.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    moveSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    moveSlider(e.clientX);
  });

  // Touch Support
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    moveSlider(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    moveSlider(e.touches[0].clientX);
  });
}

/* --------------------------------------------------------------------------
   7. Contact Page Interactive Form
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-page-form');
  const successBox = document.getElementById('contact-form-success');
  if (!form || !successBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = 'Connecting to Central Dispatch...';

    setTimeout(() => {
      form.style.display = 'none';
      successBox.style.display = 'block';
    }, 1000);
  });
}
