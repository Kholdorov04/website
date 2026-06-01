/**
 * PC Games - Main JavaScript
 * Premium interactive features
 */

'use strict';

// =============================================
// THEME MANAGER
// =============================================
const ThemeManager = {
  key: 'pcgames-theme',
  
  init() {
    const saved = localStorage.getItem(this.key);
    const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const theme = saved || preferred;
    this.apply(theme);
    
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  },
  
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.key, theme);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  },
  
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};

// =============================================
// NAVIGATION
// =============================================
const Navigation = {
  init() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Scroll effect
    const onScroll = () => {
      if (window.scrollY > 20) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    
    // Mobile menu
    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        menuToggle.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen.toString());
      });
      
      // Close on link click
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          menuToggle.classList.remove('open');
        });
      });
      
      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!navbar?.contains(e.target)) {
          navLinks.classList.remove('open');
          menuToggle.classList.remove('open');
        }
      });
    }
    
    // Active link
    this.setActiveLink();
  },
  
  setActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
};

// =============================================
// SCROLL ANIMATIONS
// =============================================
const ScrollAnimations = {
  init() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    elements.forEach(el => observer.observe(el));
  }
};

// =============================================
// COUNTER ANIMATION
// =============================================
const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(el => observer.observe(el));
  },
  
  animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, target);
      const displayValue = Number.isInteger(target) ? Math.floor(current) : current.toFixed(1);
      el.textContent = prefix + displayValue.toLocaleString() + suffix;
      
      if (step >= steps) {
        el.textContent = prefix + target.toLocaleString() + suffix;
        clearInterval(timer);
      }
    }, duration / steps);
  }
};

// =============================================
// FAQ ACCORDION
// =============================================
const FAQ = {
  init() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const question = item.querySelector('.faq-question');
      if (!question) return;
      
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        
        // Close all
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
          openItem.classList.remove('open');
        });
        
        // Open clicked (if it wasn't open)
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });
  }
};

// =============================================
// FILTER BAR (Products page)
// =============================================
const FilterBar = {
  init() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const parent = btn.closest('.filter-bar');
        parent?.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        this.filterItems(filter);
      });
    });
  },
  
  filterItems(filter) {
    const items = document.querySelectorAll('[data-category]');
    items.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.style.display = '';
        item.style.animation = 'fadeInUp 0.4s ease forwards';
      } else {
        item.style.display = 'none';
      }
    });
  }
};

// =============================================
// CONTACT FORM
// =============================================
const ContactForm = {
  init() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validate(form)) {
        this.submit(form);
      }
    });
    
    // Real-time validation
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
          this.validateField(field);
        }
      });
    });
  },
  
  validate(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!this.validateField(field)) valid = false;
    });
    return valid;
  },
  
  validateField(field) {
    const value = field.value.trim();
    let error = '';
    
    if (field.hasAttribute('required') && !value) {
      error = 'This field is required.';
    } else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Please enter a valid email address.';
    }
    
    this.setFieldError(field, error);
    return !error;
  },
  
  setFieldError(field, message) {
    let errorEl = field.parentNode.querySelector('.field-error');
    
    if (message) {
      field.classList.add('error');
      field.style.borderColor = '#ef4444';
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.style.cssText = 'color:#ef4444;font-size:0.8rem;margin-top:4px;display:block;';
        field.parentNode.appendChild(errorEl);
      }
      errorEl.textContent = message;
    } else {
      field.classList.remove('error');
      field.style.borderColor = '';
      errorEl?.remove();
    }
  },
  
  submit(form) {
    const btn = form.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#22c55e';
      form.reset();
      Toast.show('Message sent successfully! We\'ll reply within 24 hours. 📨', '✅');
      
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    }, 1500);
  }
};

// =============================================
// NEWSLETTER FORM
// =============================================
const Newsletter = {
  init() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const btn = form.querySelector('button');
        
        if (!input?.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          input.style.borderColor = '#ef4444';
          return;
        }
        
        const orig = btn.textContent;
        btn.textContent = 'Subscribed! ✓';
        btn.style.background = '#22c55e';
        btn.disabled = true;
        input.value = '';
        
        Toast.show('You\'re subscribed! Check your inbox for a welcome email. 🎉', '📧');
        
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      });
    });
  }
};

// =============================================
// TOAST NOTIFICATIONS
// =============================================
const Toast = {
  show(message, icon = 'ℹ️', duration = 4000) {
    const existing = document.querySelector('.toast');
    existing?.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }
};

// =============================================
// BACK TO TOP
// =============================================
const BackToTop = {
  init() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// =============================================
// SMOOTH SCROLL for anchor links
// =============================================
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }
};

// =============================================
// HERO PARALLAX
// =============================================
const Parallax = {
  init() {
    const orbs = document.querySelectorAll('.hero-orb');
    if (!orbs.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      
      orbs.forEach((orb, i) => {
        const intensity = (i + 1) * 8;
        orb.style.transform = `translate(${dx * intensity}px, ${dy * intensity}px)`;
      });
    }, { passive: true });
  }
};

// =============================================
// INIT ALL
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Navigation.init();
  ScrollAnimations.init();
  CounterAnimation.init();
  FAQ.init();
  FilterBar.init();
  ContactForm.init();
  Newsletter.init();
  BackToTop.init();
  SmoothScroll.init();
  Parallax.init();
  
  // Page transition class
  document.body.classList.add('page-transition');
});
