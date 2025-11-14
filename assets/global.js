/* ===========================
   Global Utilities and Helpers
   =========================== */

// Debounce function for performance
function debounce(func, wait = 300) {
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

// Throttle function for scroll events
function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Format currency
function formatMoney(cents, format = '${{amount}}') {
  if (typeof cents === 'string') {
    cents = cents.replace('.', '');
  }
  
  const value = (cents / 100.0).toFixed(2);
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  
  return format.replace(placeholderRegex, value);
}

// Get cookie value
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Set cookie
function setCookie(name, value, days = 30) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Animate on scroll
class ScrollAnimator {
  constructor() {
    this.elements = document.querySelectorAll('[data-scroll-animate]');
    this.init();
  }

  init() {
    if (!this.elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    this.elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
}

// Toast notification
class Toast {
  constructor(message, type = 'info', duration = 3000) {
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.show();
  }

  show() {
    const toast = document.createElement('div');
    toast.className = `toast toast-${this.type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-message">${this.message}</span>
        <button class="toast-close" aria-label="Close">&times;</button>
      </div>
    `;

    const styles = `
      .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        min-width: 250px;
        max-width: 400px;
        padding: 1rem 1.5rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
      }

      [data-theme="dark"] .toast {
        background: #2a2a2a;
        color: #f5f5f5;
      }

      .toast-success { border-left: 4px solid #22c55e; }
      .toast-error { border-left: 4px solid #ef4444; }
      .toast-warning { border-left: 4px solid #f59e0b; }
      .toast-info { border-left: 4px solid #3b82f6; }

      .toast-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      .toast-message {
        flex: 1;
        font-size: 0.95rem;
      }

      .toast-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        opacity: 0.6;
        transition: opacity 0.3s ease;
      }

      .toast-close:hover {
        opacity: 1;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;

    if (!document.getElementById('toast-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'toast-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    document.body.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.hide(toast));

    if (this.duration > 0) {
      setTimeout(() => this.hide(toast), this.duration);
    }
  }

  hide(toast) {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }
}

// Loading indicator
class LoadingIndicator {
  constructor() {
    this.loader = null;
  }

  show(message = 'Loading...') {
    if (this.loader) return;

    this.loader = document.createElement('div');
    this.loader.className = 'loading-indicator';
    this.loader.innerHTML = `
      <div class="loading-spinner"></div>
      <p class="loading-message">${message}</p>
    `;

    const styles = `
      .loading-indicator {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        gap: 1rem;
      }

      .loading-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .loading-message {
        color: white;
        font-size: 1rem;
        margin: 0;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;

    if (!document.getElementById('loading-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'loading-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    document.body.appendChild(this.loader);
  }

  hide() {
    if (this.loader) {
      this.loader.remove();
      this.loader = null;
    }
  }
}

// Export utilities
window.MysticUtils = {
  debounce,
  throttle,
  formatMoney,
  getCookie,
  setCookie,
  isInViewport,
  Toast,
  LoadingIndicator,
  ScrollAnimator
};

// Initialize scroll animations when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimator();
  });
} else {
  new ScrollAnimator();
}