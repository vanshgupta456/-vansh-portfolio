// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Reveal-on-scroll for skill bars + animated stat counters
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimal || '0', 10);
  const suffix = el.dataset.suffix || '';
  if (prefersReducedMotion) {
    el.textContent = target.toFixed(decimals) + suffix;
    return;
  }
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = value.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    if (entry.target.classList.contains('skill-bar')) {
      entry.target.classList.add('in-view');
    }
    if (entry.target.classList.contains('stat-row')) {
      entry.target.querySelectorAll('dd[data-count]').forEach(animateCount);
    }
    observer.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar').forEach(bar => observer.observe(bar));
document.querySelectorAll('.stat-row').forEach(row => observer.observe(row));

// Contact form — sent via EmailJS (https://www.emailjs.com)
// Fill in your own values from the EmailJS dashboard:
const EMAILJS_PUBLIC_KEY = 'rLQ7oSeKDAXRG-eCU';
const EMAILJS_SERVICE_ID = 'service_4cwbwnd';
const EMAILJS_TEMPLATE_ID = 'template_v3ocp5s';

if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

const form = document.getElementById('contact-form');
const note = document.getElementById('form-note');
const submitBtn = form ? form.querySelector('.form-submit') : null;

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      note.textContent = 'Please fill in every field before sending.';
      return;
    }

    if (!window.emailjs || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      note.textContent = 'Email sending isn\'t configured yet — add your EmailJS keys in script.js.';
      return;
    }

    submitBtn.disabled = true;
    note.textContent = 'Sending…';

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name: name,
      from_email: email,
      message: message,
    }).then(() => {
      note.textContent = 'Message sent — thanks for reaching out!';
      form.reset();
      submitBtn.disabled = false;
    }).catch((err) => {
      console.error('EmailJS error:', err);
      note.textContent = 'Something went wrong — please email me directly instead.';
      submitBtn.disabled = false;
    });
  });
}
