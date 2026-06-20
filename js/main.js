// ÉLAN — Shared client-side runtime
// Lenis smooth scroll, custom cursor, reveal animations, cart drawer, nav.

(function () {
  // ===== Loader =====
  window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (!loader) return;
    setTimeout(() => loader.classList.add('is-hidden'), 1700);
  });

  // ===== Custom Cursor =====
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  function animateCursor() {
    curX += (mouseX - curX) * 0.18;
    curY += (mouseY - curY) * 0.18;
    cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('mouseover', (e) => {
    const t = e.target;
    if (t.closest('a, button, [data-hover]')) {
      cursor.classList.add('is-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    const t = e.target;
    if (t.closest('a, button, [data-hover]')) {
      cursor.classList.remove('is-hover');
    }
  });

  // ===== Lenis smooth scroll =====
  let lenis;
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    window.elanLenis = lenis;
  }
  initLenis();

  // ===== Reveal animations =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.reveal, .split-line').forEach(el => observer.observe(el));

  // ===== Nav scroll behavior =====
  const nav = document.querySelector('.nav');
  if (nav) {
    // If nav starts solid (content pages), keep it solid always.
    const startsSolid = nav.classList.contains('is-solid');
    if (!startsSolid) {
      window.addEventListener('scroll', () => {
        nav.classList.toggle('is-solid', window.scrollY > 80);
      });
    }
  }

  // ===== Cart drawer =====
  function openCart() {
    document.body.classList.add('cart-open');
    document.querySelector('.cart-drawer')?.classList.add('is-open');
    document.querySelector('.cart-overlay')?.classList.add('is-open');
    if (lenis) lenis.stop();
    renderCartDrawer();
  }
  function closeCart() {
    document.body.classList.remove('cart-open');
    document.querySelector('.cart-drawer')?.classList.remove('is-open');
    document.querySelector('.cart-overlay')?.classList.remove('is-open');
    if (lenis) lenis.start();
  }

  function renderCartDrawer() {
    const body = document.querySelector('.cart-drawer__body');
    const totalEl = document.querySelector('.cart-drawer__total-amount');
    if (!body) return;
    const cart = window.ElanCart.getCart();
    if (cart.length === 0) {
      body.innerHTML = `
        <div class="cart-drawer__empty">
          <div>Your bag is quiet.</div>
          <a href="shop.html" class="btn btn--ink"><span>Discover the collection</span></a>
        </div>`;
      if (totalEl) totalEl.textContent = '$0';
      return;
    }
    body.innerHTML = cart.map(item => {
      const product = window.PRODUCTS.find(p => p.id === item.productId);
      if (!product) return '';
      return `
        <div class="cart-line">
          <div class="cart-line__img" style="background-image:url('${product.images[0]}')"></div>
          <div>
            <div class="cart-line__name">${product.name}</div>
            <div class="cart-line__meta">${product.color} · Size ${item.size}</div>
            <div class="cart-line__qty">
              <button data-act="dec" data-id="${product.id}" data-size="${item.size}">−</button>
              <span>${item.qty}</span>
              <button data-act="inc" data-id="${product.id}" data-size="${item.size}">+</button>
            </div>
            <button class="cart-line__remove" data-act="rm" data-id="${product.id}" data-size="${item.size}">Remove</button>
          </div>
          <div>
            <div class="cart-line__price">${window.formatPrice(product.price * item.qty)}</div>
          </div>
        </div>`;
    }).join('');
    if (totalEl) totalEl.textContent = window.formatPrice(window.ElanCart.getCartTotal());

    body.querySelectorAll('button[data-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id, size = btn.dataset.size, act = btn.dataset.act;
        const item = window.ElanCart.getCart().find(i => i.productId === id && i.size === size);
        if (!item) return;
        if (act === 'inc') window.ElanCart.updateQty(id, size, item.qty + 1);
        if (act === 'dec') window.ElanCart.updateQty(id, size, item.qty - 1);
        if (act === 'rm') window.ElanCart.removeFromCart(id, size);
        renderCartDrawer();
      });
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-cart-open]')) {
      e.preventDefault();
      openCart();
    }
    if (e.target.closest('[data-cart-close]')) {
      closeCart();
    }
    if (e.target.closest('.cart-overlay')) {
      closeCart();
    }
  });

  window.addEventListener('cart:change', () => {
    if (document.querySelector('.cart-drawer.is-open')) renderCartDrawer();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });

  // ===== Year =====
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // ===== Newsletter (toy) =====
  document.querySelectorAll('.newsletter form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (!input.value) return;
      input.value = '';
      input.placeholder = 'Welcome to the atelier.';
    });
  });
})();
