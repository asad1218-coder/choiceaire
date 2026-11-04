/**
 * Choice Aire - 7-8 Figure Trade Platform Interactive Application Logic
 * Implements Drawer State, Multi-step Dispatch, Before/After Slider,
 * Financing Calculator, Diagnostics Routing, and Quiz Estimator.
 */

document.addEventListener('DOMContentLoaded', () => {
  initDispatchDrawer();
  initDiagnosticCards();
  initFinancingCalculator();
  initRoiCalculator();
  initBeforeAfterSlider();
  initDivisionTabs();
  initQuizModal();
  initLiveClock();
  initMobileMenu();
});

/* ==========================================================================
   1. SLIDE-OUT DISPATCH DRAWER & MULTI-STEP BOOKING
   ========================================================================== */
function initDispatchDrawer() {
  const drawer = document.getElementById('dispatchDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerClose');
  const openButtons = document.querySelectorAll('.open-drawer-btn');
  const dispatchForm = document.getElementById('dispatchForm');

  if (!drawer || !overlay) return;

  function openDrawer(prefillService = '') {
    drawer.classList.add('active');
    overlay.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (prefillService) {
      const radio = document.querySelector(`input[name="serviceType"][value="${prefillService}"]`);
      if (radio) {
        radio.checked = true;
      }
    }
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      openDrawer(service);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeQuizModal();
    }
  });

  // Multi-step navigation inside drawer
  const nextButtons = document.querySelectorAll('.step-next-btn');
  const prevButtons = document.querySelectorAll('.step-prev-btn');
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const formSteps = document.querySelectorAll('.form-step');

  function goToStep(stepNum) {
    formSteps.forEach(step => step.classList.remove('active'));
    const targetStep = document.getElementById(`step${stepNum}`);
    if (targetStep) targetStep.classList.add('active');

    stepIndicators.forEach(ind => {
      const indStep = parseInt(ind.getAttribute('data-step'), 10);
      ind.classList.remove('active');
      if (indStep === stepNum) {
        ind.classList.add('active');
      } else if (indStep < stepNum) {
        ind.classList.add('done');
      }
    });
  }

  nextButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextStep = parseInt(btn.getAttribute('data-next'), 10);
      
      // Basic validation for Step 2
      if (nextStep === 3) {
        const street = document.getElementById('drawerStreet');
        const city = document.getElementById('drawerCity');
        const zip = document.getElementById('drawerZip');
        if (!street.value.trim() || !city.value.trim() || !zip.value.trim()) {
          showToast('⚠️ Please enter your street address, city, and 5-digit zip code.');
          return;
        }
      }

      goToStep(nextStep);
    });
  });

  prevButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const prevStep = parseInt(btn.getAttribute('data-prev'), 10);
      goToStep(prevStep);
    });
  });

  // Form submission handler
  if (dispatchForm) {
    dispatchForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fName = document.getElementById('drawerFirstName').value.trim();
      const phone = document.getElementById('drawerPhone').value.trim();
      const city = document.getElementById('drawerCity').value.trim() || 'Akron';
      const service = document.querySelector('input[name="serviceType"]:checked')?.value || 'Emergency Service';

      const submitBtn = dispatchForm.querySelector('.btn-dispatch-submit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>⏳ Routing to Nearest Van...</span>`;
      }

      setTimeout(() => {
        closeDrawer();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>🚨 Confirm & Dispatch Technician</span>`;
        }

        showToast(`🚨 DISPATCH CONFIRMED! Tech Dave is en route to ${city} with Bryant OEM parts. Arrival ETA: 34 mins.`);

        // Reset to step 1
        dispatchForm.reset();
        goToStep(1);
      }, 1200);
    });
  }
}

/* ==========================================================================
   2. INTERACTIVE DIAGNOSTIC CARDS
   ========================================================================== */
function initDiagnosticCards() {
  const cards = document.querySelectorAll('.issue-card');
  const drawer = document.getElementById('dispatchDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const notesField = document.getElementById('drawerIssueNotes');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const issue = card.getAttribute('data-issue') || '';
      const desc = card.getAttribute('data-desc') || '';

      if (notesField) {
        notesField.value = `Diagnostic selection: ${issue} (${desc}). Please inspect upon arrival.`;
      }

      // Pre-select service type based on issue
      let serviceRadioVal = 'Emergency Repair';
      if (issue.includes('Commercial')) {
        serviceRadioVal = 'Commercial HVAC';
      }

      const radio = document.querySelector(`input[name="serviceType"][value="${serviceRadioVal}"]`);
      if (radio) radio.checked = true;

      // Open drawer
      if (drawer && overlay) {
        drawer.classList.add('active');
        overlay.classList.add('active');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }

      showToast(`⚡ Issue pre-filled: "${issue}". Select your address for dispatch window.`);
    });
  });
}

/* ==========================================================================
   3. GOOD / BETTER / BEST FINANCING CALCULATOR
   ========================================================================== */
function initFinancingCalculator() {
  const creditSelect = document.getElementById('creditScoreSelect');
  const downSlider = document.getElementById('downPaymentSlider');
  const downValueTxt = document.getElementById('downPaymentValue');

  const tier1Monthly = document.getElementById('tier1Monthly');
  const tier2Monthly = document.getElementById('tier2Monthly');
  const tier3Monthly = document.getElementById('tier3Monthly');

  if (!downSlider || !tier1Monthly) return;

  // Base cash prices
  const basePrices = {
    tier1: 4850,
    tier2: 6950,
    tier3: 9400
  };

  // APR factors by credit tier (84-month term simulation)
  const aprFactors = {
    tierA: 0.0152, // Promo rate / ~6.99% APR over 84 mos
    tierB: 0.0163, // ~8.99% APR
    tierC: 0.0178  // ~11.99% APR
  };

  function updateCalculations() {
    const downPayment = parseInt(downSlider.value, 10);
    downValueTxt.textContent = downPayment === 0 ? '$0 Down' : `$${downPayment.toLocaleString()} Down`;

    const creditTier = creditSelect ? creditSelect.value : 'tierA';
    const factor = aprFactors[creditTier] || aprFactors.tierA;

    const t1FinanceAmount = Math.max(0, basePrices.tier1 - downPayment);
    const t2FinanceAmount = Math.max(0, basePrices.tier2 - downPayment);
    const t3FinanceAmount = Math.max(0, basePrices.tier3 - downPayment);

    const m1 = Math.round(t1FinanceAmount * factor);
    const m2 = Math.round(t2FinanceAmount * factor);
    const m3 = Math.round(t3FinanceAmount * factor);

    tier1Monthly.textContent = m1 > 0 ? m1 : 0;
    tier2Monthly.textContent = m2 > 0 ? m2 : 0;
    tier3Monthly.textContent = m3 > 0 ? m3 : 0;
  }

  downSlider.addEventListener('input', updateCalculations);
  if (creditSelect) {
    creditSelect.addEventListener('change', updateCalculations);
  }
}

/* ==========================================================================
   3B. INSTANT ROI & IRA REBATE CALCULATOR (LAWNLINE HARD NUMBERS PSYCHOLOGY)
   ========================================================================== */
function initRoiCalculator() {
  const ageSelect = document.getElementById('systemAgeSelect');
  const billSlider = document.getElementById('currentBillSlider');
  const currentBillVal = document.getElementById('currentBillVal');
  const annualSavingsVal = document.getElementById('annualSavingsVal');
  const taxCreditVal = document.getElementById('taxCreditVal');
  const tenYearSavingsVal = document.getElementById('tenYearSavingsVal');

  if (!billSlider || !annualSavingsVal) return;

  // Efficiency reduction percentages based on age of old unit
  const ageReductionRates = {
    old10: 0.32, // ~32% reduction
    old15: 0.44, // ~44% reduction
    old20: 0.58  // ~58% reduction
  };

  function updateRoi() {
    const monthlyBill = parseInt(billSlider.value, 10);
    if (currentBillVal) currentBillVal.textContent = `$${monthlyBill}/mo`;

    const ageKey = ageSelect ? ageSelect.value : 'old15';
    const rate = ageReductionRates[ageKey] || 0.44;

    const monthlySaved = Math.round(monthlyBill * rate);
    const annualSaved = monthlySaved * 12;
    const federalCredit = 2000;
    const tenYearTotal = (annualSaved * 10) + federalCredit;

    if (annualSavingsVal) annualSavingsVal.textContent = `$${annualSaved.toLocaleString()}`;
    if (taxCreditVal) taxCreditVal.textContent = `$${federalCredit.toLocaleString()}`;
    if (tenYearSavingsVal) tenYearSavingsVal.textContent = `$${tenYearTotal.toLocaleString()}+`;
  }

  billSlider.addEventListener('input', updateRoi);
  if (ageSelect) {
    ageSelect.addEventListener('change', updateRoi);
  }

  updateRoi();
}

/* ==========================================================================
   4. BEFORE / AFTER IMAGE COMPARISON SLIDER
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('beforeAfterContainer');
  const beforeWrapper = document.getElementById('beforeWrapper');
  const sliderHandle = document.getElementById('sliderHandle');

  if (!container || !beforeWrapper || !sliderHandle) return;

  let isDragging = false;

  function setSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percentage = (offsetX / rect.width) * 100;
    beforeWrapper.style.width = `${percentage}%`;
    sliderHandle.style.left = `${percentage}%`;
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  // Touch Support
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches.length > 0) {
      setSliderPosition(e.touches[0].clientX);
    }
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length === 0) return;
    setSliderPosition(e.touches[0].clientX);
  });
}

/* ==========================================================================
   5. RESIDENTIAL VS COMMERCIAL DIVISION TABS
   ========================================================================== */
function initDivisionTabs() {
  const tabButtons = document.querySelectorAll('.div-tab-btn');
  const tabContents = document.querySelectorAll('.division-tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(`tab-${target}`);
      if (activeContent) activeContent.classList.add('active');
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE HVAC QUIZ / COST ESTIMATOR MODAL
   ========================================================================== */
function closeQuizModal() {
  const modal = document.getElementById('quizModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function initQuizModal() {
  const modal = document.getElementById('quizModal');
  const openButtons = document.querySelectorAll('.open-quiz-btn');
  const closeBtn = document.getElementById('quizModalClose');

  if (!modal) return;

  function openQuiz() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    resetQuiz();
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openQuiz();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeQuizModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeQuizModal();
  });

  const quizSteps = document.querySelectorAll('.quiz-step');
  const quizButtons = document.querySelectorAll('.quiz-opt-btn');

  const quizAnswers = {
    sqft: '',
    tempBalance: '',
    priority: ''
  };

  function resetQuiz() {
    quizSteps.forEach(s => s.classList.remove('active'));
    const step1 = document.getElementById('qStep1');
    if (step1) step1.classList.add('active');
  }

  quizButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-q');
      const val = btn.getAttribute('data-val');
      quizAnswers[q] = val;

      if (q === 'sqft') {
        document.getElementById('qStep1').classList.remove('active');
        document.getElementById('qStep2').classList.add('active');
      } else if (q === 'tempBalance') {
        document.getElementById('qStep2').classList.remove('active');
        document.getElementById('qStep3').classList.add('active');
      } else if (q === 'priority') {
        document.getElementById('qStep3').classList.remove('active');
        renderQuizResult();
        document.getElementById('qResult').classList.add('active');
      }
    });
  });

  function renderQuizResult() {
    const titleEl = document.getElementById('recTitle');
    const textEl = document.getElementById('recText');

    if (quizAnswers.priority === 'bills' || quizAnswers.sqft === '2400+') {
      titleEl.textContent = 'Bryant Evolution Inverter 20+ SEER2 (Max Tax Credit)';
      textEl.textContent = 'Ideal for your home size. Cuts electric costs by up to 50% and unlocks the full $2,000 Federal IRA Clean Energy Tax Credit plus local Ohio utility rebates.';
    } else if (quizAnswers.priority === 'quiet' || quizAnswers.tempBalance === 'yes') {
      titleEl.textContent = 'Bryant Preferred Two-Stage 18 SEER2 with Smart Zoning';
      textEl.textContent = 'Eliminates hot & cold spots across floors with two-stage variable modulation. Whisper-quiet 60dB operation and qualifies for $1,200 rebates.';
    } else {
      titleEl.textContent = 'Bryant Reliable Standard 15-16 SEER2 High Efficiency';
      textEl.textContent = 'Lowest upfront investment with rock-solid durability. Starts at just $89/month with $0 down and full 10-year factory warranty protection.';
    }
  }
}

/* ==========================================================================
   7. LIVE RADAR CLOCK & STATUS SIMULATOR
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('systemClock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    clockEl.textContent = `Akron / Canton Hub: ONLINE • ${timeStr}`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   8. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle');
  const nav = document.querySelector('.desktop-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isShown = nav.style.display === 'flex';
    if (isShown) {
      nav.style.display = '';
    } else {
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '76px';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.background = '#0a0f18';
      nav.style.padding = '20px';
      nav.style.borderBottom = '1px solid var(--border-subtle)';
    }
  });
}

/* ==========================================================================
   TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4500);
}
