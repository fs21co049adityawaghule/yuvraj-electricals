// =============================================
// YUVRAJ ELECTRICALS - Main JavaScript
// =============================================

(function () {
  'use strict';

  // ---- Navbar Scroll Effect ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ---- Mobile Menu ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  // ---- Active Nav Link (single-page) ----
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
  setActiveNavLink();

  // ---- Back to Top ----
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Enquiry Form with WhatsApp ----
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    // Pre-select service from URL param (for "Enquire Now" buttons)
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam) {
      const serviceSelect = document.getElementById('serviceRequired');
      if (serviceSelect) {
        for (let opt of serviceSelect.options) {
          if (opt.value === serviceParam) {
            opt.selected = true;
            break;
          }
        }
      }
    }

    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm()) {
        const msg = buildWhatsAppMessage();
        const encoded = encodeURIComponent(msg);
        const waUrl = `https://wa.me/919920124975?text=${encoded}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        showFormSuccess();
      }
    });
  }

  function validateForm() {
    let valid = true;
    const fields = [
      { id: 'customerName', errId: 'errName', validate: v => v.trim().length >= 2, msg: 'Please enter your name (at least 2 characters).' },
      { id: 'phoneNumber', errId: 'errPhone', validate: v => /^[6-9]\d{9}$/.test(v.trim().replace(/\s+/g, '')), msg: 'Please enter a valid 10-digit Indian mobile number.' },
      { id: 'serviceRequired', errId: 'errService', validate: v => v !== '', msg: 'Please select a service.' },
      { id: 'projectDesc', errId: 'errDesc', validate: v => v.trim().length >= 10, msg: 'Please describe your requirements (at least 10 characters).' },
    ];

    // Optional email validation
    const emailEl = document.getElementById('emailAddress');
    if (emailEl && emailEl.value.trim()) {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim());
      const emailErr = document.getElementById('errEmail');
      setFieldError(emailEl, emailErr, emailValid ? '' : 'Please enter a valid email address.');
      if (!emailValid) valid = false;
    }

    fields.forEach(f => {
      const el = document.getElementById(f.id);
      const errEl = document.getElementById(f.errId);
      if (!el) return;
      const isValid = f.validate(el.value);
      setFieldError(el, errEl, isValid ? '' : f.msg);
      if (!isValid) valid = false;
    });

    return valid;
  }

  function setFieldError(el, errEl, msg) {
    if (msg) {
      el.classList.add('error');
      if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
    } else {
      el.classList.remove('error');
      if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
    }
  }

  // Clear errors on input
  document.querySelectorAll('#enquiryForm input, #enquiryForm select, #enquiryForm textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('error');
      const errId = el.getAttribute('data-err');
      if (errId) {
        const errEl = document.getElementById(errId);
        if (errEl) errEl.classList.remove('show');
      }
    });
  });

  function buildWhatsAppMessage() {
    const name = document.getElementById('customerName')?.value.trim() || '';
    const company = document.getElementById('companyName')?.value.trim() || '';
    const phone = document.getElementById('phoneNumber')?.value.trim() || '';
    const email = document.getElementById('emailAddress')?.value.trim() || '';
    const service = document.getElementById('serviceRequired')?.value || '';
    const panelType = document.getElementById('panelType')?.value.trim() || '';
    const desc = document.getElementById('projectDesc')?.value.trim() || '';
    const qty = document.getElementById('quantity')?.value.trim() || '';
    const contactMethod = document.querySelector('input[name="contactMethod"]:checked')?.value || 'WhatsApp';

    let msg = `Hello Yuvraj Electricals,\n\nI would like to enquire about your electrical services.\n\n`;
    msg += `*Enquiry Details*\n`;
    msg += `─────────────────\n`;
    msg += `*Name:* ${name}\n`;
    if (company) msg += `*Company:* ${company}\n`;
    msg += `*Phone:* ${phone}\n`;
    if (email) msg += `*Email:* ${email}\n`;
    msg += `*Service Required:* ${service}\n`;
    if (panelType) msg += `*Panel Type:* ${panelType}\n`;
    if (qty) msg += `*Quantity:* ${qty}\n`;
    msg += `*Preferred Contact:* ${contactMethod}\n`;
    msg += `\n*Project Description:*\n${desc}\n`;
    msg += `\nKindly provide a quotation at your earliest convenience. Thank you!`;
    return msg;
  }

  function showFormSuccess() {
    const successEl = document.getElementById('formSuccess');
    if (successEl) {
      successEl.style.display = 'block';
      successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => { successEl.style.display = 'none'; }, 10000);
    }
  }

  // ---- Enquire Now Buttons (Services Page) ----
  document.querySelectorAll('[data-service-enquire]').forEach(btn => {
    btn.addEventListener('click', () => {
      const service = btn.getAttribute('data-service-enquire');
      window.location.href = `contact.html?service=${encodeURIComponent(service)}`;
    });
  });

})();
