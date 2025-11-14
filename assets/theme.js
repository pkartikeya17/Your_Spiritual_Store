/* ===========================
   Theme Toggle Functionality
   =========================== */

class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('themeToggle');
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.setTheme(this.currentTheme, false);
    
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  setTheme(theme, save = true) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    
    if (save) {
      localStorage.setItem('theme', theme);
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}

/* ===========================
   Mobile Menu Functionality
   =========================== */

class MobileMenu {
  constructor() {
    this.toggle = document.getElementById('mobileMenuToggle');
    this.nav = document.getElementById('headerNav');
    this.overlay = document.getElementById('mobileMenuOverlay');
    this.isOpen = false;
    this.init();
  }

  init() {
    if (this.toggle) {
      this.toggle.addEventListener('click', () => this.toggleMenu());
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeMenu());
    }

    // Close menu when clicking nav links
    if (this.nav) {
      const links = this.nav.querySelectorAll('.nav-link');
      links.forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });
    }

    // Close menu on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.isOpen = true;
    this.nav?.classList.add('active');
    this.overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.isOpen = false;
    this.nav?.classList.remove('active');
    this.overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ===========================
   Header Scroll Effect
   =========================== */

class HeaderScroll {
  constructor() {
    this.header = document.querySelector('.site-header');
    this.lastScroll = 0;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll());
  }

  handleScroll() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      this.header?.classList.add('scrolled');
    } else {
      this.header?.classList.remove('scrolled');
    }

    this.lastScroll = currentScroll;
  }
}

/* ===========================
   Cart Functionality
   =========================== */

class CartManager {
  constructor() {
    this.cartCount = document.getElementById('cartCount');
    this.init();
  }

  init() {
    this.updateCartCount();
  }

  async updateCartCount() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      
      if (this.cartCount) {
        this.cartCount.textContent = cart.item_count;
        
        if (cart.item_count > 0) {
          this.cartCount.style.display = 'flex';
        } else {
          this.cartCount.style.display = 'none';
        }
      }
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  }

  async addToCart(variantId, quantity = 1) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: variantId,
          quantity: quantity
        })
      });

      if (response.ok) {
        await this.updateCartCount();
        this.showNotification('Item added to cart!');
        return true;
      } else {
        throw new Error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.showNotification('Error adding item to cart', 'error');
      return false;
    }
  }

  showNotification(message, type = 'success') {
    // Simple notification - can be enhanced
    const notification = document.createElement('div');
    notification.className = `cart-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 1rem 1.5rem;
      background-color: ${type === 'success' ? 'var(--color-accent)' : '#e74c3c'};
      color: white;
      border-radius: 8px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

/* ===========================
   Product Image Gallery
   =========================== */

class ProductGallery {
  constructor(container) {
    this.container = container;
    this.mainImage = container?.querySelector('.product-main-image img');
    this.thumbnails = container?.querySelectorAll('.thumbnail-image');
    this.init();
  }

  init() {
    if (!this.container) return;

    this.thumbnails.forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        const newSrc = thumb.dataset.fullSize || thumb.src;
        
        if (this.mainImage) {
          // Fade out
          this.mainImage.style.opacity = '0';
          
          setTimeout(() => {
            this.mainImage.src = newSrc;
            // Fade in
            this.mainImage.style.opacity = '1';
          }, 200);
        }

        // Update active thumbnail
        this.thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  }
}

/* ===========================
   Smooth Scroll
   =========================== */

class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

/* ===========================
   Lazy Loading Images
   =========================== */

class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      });

      this.images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      this.images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }
}

/* ===========================
   Initialize Everything
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize core components
  new ThemeManager();
  new MobileMenu();
  new HeaderScroll();
  
  // Initialize cart
  window.cartManager = new CartManager();
  
  // Initialize product galleries
  document.querySelectorAll('.product-gallery').forEach(gallery => {
    new ProductGallery(gallery);
  });
  
  // Initialize smooth scroll
  new SmoothScroll();
  
  // Initialize lazy loading
  new LazyLoader();

  console.log('MysticAura theme loaded successfully');
});

// Export for use in other scripts
window.MysticAura = {
  ThemeManager,
  CartManager,
  ProductGallery
};