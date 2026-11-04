/**
 * Choice Aire — Universal Application Logic
 * Powered by Lawnline Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initQuoteDrawer();
  initTriageRouting();
  initRoiCalculator();
  initComparisonSlider();
});

/* --------------------------------------------------------------------------
   1. Header Sticky Effect
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.getElementById('header') || document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle') || document.querySelector('.mobile-toggle');
  const nav = document.getElementById('nav') || document.querySelector('.nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    toggle.classList.toggle('active');
  });

  // Dropdown toggle on mobile
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.has-dropdown');
      if (parent) {
        parent.classList.toggle('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Quote Drawer (Lawnline Style)
   -------------------------------------------------------------------------- */
function initQuoteDrawer() {
  const drawer = document.getElementById('quoteDrawer') || document.querySelector('.quote-drawer');
  const overlay = document.getElementById('quoteOverlay') || document.querySelector('.quote-drawer-overlay');
  const closeBtn = document.getElementById('quoteClose') || document.querySelector('.quote-drawer-close');
  const openButtons = document.querySelectorAll('#quoteBtn, #bottomQuoteBtn, .open-quote-btn, .btn-primary[id*="Quote"]');

  if (!drawer || !overlay) return;

  const openDrawer = (serviceVal) => {
    if (serviceVal) {
      const select = document.getElementById('quote-service');
      if (select) select.value = serviceVal;
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
      openDrawer(btn.getAttribute('data-service'));
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // Drawer Form Submit
  const form = document.getElementById('mainQuoteForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Transmitting to Akron Dispatch...';

      setTimeout(() => {
        form.innerHTML = `
          <div style="text-align:center; padding:30px 10px;">
            <div style="width:60px; height:60px; background:rgba(0,210,255,0.2); border:2px solid var(--color-lime-green); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px auto; color:var(--color-lime-green); font-size:24px; font-weight:800;">✓</div>
            <h3 style="color:#fff; text-transform:uppercase; margin-bottom:10px;">Priority Dispatch Confirmed</h3>
            <p style="color:var(--color-gray-lighter); font-size:15px; margin-bottom:20px;">Your request is en route to our Akron Central Operations Board. An Ohio coordinator will call and text you within 15 minutes.</p>
            <div style="background:#111; border:1px solid var(--color-lime-green); padding:12px; border-radius:8px; font-weight:700; color:var(--color-lime-green);">
              Estimated Tech On-Site Window: 35-45 Minutes
            </div>
          </div>
        `;
      }, 1000);
    });
  }
}

/* --------------------------------------------------------------------------
   4. Triage Buttons Pre-Fill
   -------------------------------------------------------------------------- */
function initTriageRouting() {
  const triageButtons = document.querySelectorAll('.triage-trigger');
  const drawer = document.getElementById('quoteDrawer');
  const overlay = document.getElementById('quoteOverlay');
  const select = document.getElementById('quote-service');
  const notes = document.getElementById('quote-notes');

  triageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const issue = btn.getAttribute('data-issue') || 'AC Emergency';
      if (select) {
        if (issue.includes('AC')) select.value = 'emergency-ac';
        else if (issue.includes('Furnace')) select.value = 'furnace-no-heat';
        else if (issue.includes('Inverter')) select.value = 'heat-pump-inverter';
        else select.value = 'emergency-ac';
      }
      if (notes) {
        notes.value = `Reported symptom: ${issue}. Please dispatch nearest technician.`;
      }
      if (drawer && overlay) {
        drawer.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive 10-Year ROI Calculator
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

  const update = () => {
    const age = parseInt(ageSlider.value, 10);
    const bill = parseInt(billSlider.value, 10);

    if (ageVal) ageVal.textContent = `${age} Years Old`;
    if (billVal) billVal.textContent = `$${bill}/mo`;

    let gain = 0.32;
    if (age >= 12 && age < 16) gain = 0.44;
    else if (age >= 16) gain = 0.54;

    const annualSavings = Math.round(bill * 12 * gain);
    const taxCredit = 2000;
    const tenYear = (annualSavings * 10) + taxCredit;

    if (annualSavingsEl) annualSavingsEl.textContent = `$${annualSavings.toLocaleString()}/yr`;
    if (taxCreditEl) taxCreditEl.textContent = `$${taxCredit.toLocaleString()}`;
    if (tenYearTotalEl) tenYearTotalEl.textContent = `$${tenYear.toLocaleString()}`;
  };

  ageSlider.addEventListener('input', update);
  billSlider.addEventListener('input', update);
  update();
}

/* --------------------------------------------------------------------------
   6. Touch / Mouse Comparison Slider
   -------------------------------------------------------------------------- */
function initComparisonSlider() {
  const container = document.querySelector('.comparison-slider-box');
  const afterBox = document.querySelector('.comparison-after');
  const handle = document.querySelector('.comparison-slider-handle');

  if (!container || !afterBox || !handle) return;

  let dragging = false;

  const setPos = (x) => {
    const rect = container.getBoundingClientRect();
    let posX = x - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;

    const pct = (posX / rect.width) * 100;
    afterBox.style.width = `${pct}%`;
    handle.style.left = `${pct}%`;
  };

  container.addEventListener('mousedown', (e) => {
    dragging = true;
    setPos(e.clientX);
  });

  window.addEventListener('mouseup', () => { dragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    setPos(e.clientX);
  });

  container.addEventListener('touchstart', (e) => {
    dragging = true;
    setPos(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => { dragging = false; });
  window.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    setPos(e.touches[0].clientX);
  });
}
