// PRODUCT — render PDP, gallery, size, add to cart
(function () {
  const root = document.getElementById('pdp');
  const related = document.getElementById('pdpRelated');
  if (!root) return;

  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const product = window.PRODUCTS.find(p => p.id === id);

  if (!product) {
    root.innerHTML = `<div class="pdp-not-found">Piece not found.<br><a href="shop.html" class="btn btn--ink" style="margin-top:32px;"><span>Back to Shop</span></a></div>`;
    if (related) related.innerHTML = '';
    return;
  }

  document.title = `${product.name} — ÉLAN`;

  let activeImg = 0;
  let activeSize = product.sizes[0];

  function render() {
    root.innerHTML = `
      <div class="pdp__inner">
        <div class="pdp-gallery">
          <div class="pdp-gallery__main">
            ${product.images.map((src, i) => `
              <div class="pdp-gallery__main-img ${i === activeImg ? 'is-active' : ''}" data-i="${i}" style="background-image:url('${src}')"></div>
            `).join('')}
          </div>
          <div class="pdp-gallery__thumbs">
            ${product.images.map((src, i) => `
              <div class="pdp-thumb ${i === activeImg ? 'is-active' : ''}" data-i="${i}" style="background-image:url('${src}')"></div>
            `).join('')}
          </div>
        </div>

        <aside class="pdp-info">
          <div class="pdp-info__breadcrumb">
            <a href="shop.html">Shop</a> / <a href="shop.html?cat=${product.category}">${product.category}</a> / ${product.name}
          </div>
          <h1>${product.name}</h1>
          <div class="pdp-info__meta">
            <span>${product.season}</span>
            <span>${product.color}</span>
            <span>${product.composition}</span>
          </div>
          <div class="pdp-info__price">${window.formatPrice(product.price)}</div>
          <p class="pdp-info__desc">${product.description}</p>

          <div class="pdp-section">
            <h3>Size <a href="#" class="pdp-size-guide" style="float: right;">Size Guide</a></h3>
            <div class="pdp-sizes">
              ${product.sizes.map(s => `<button class="pdp-size ${s === activeSize ? 'is-active' : ''}" data-size="${s}">${s}</button>`).join('')}
            </div>
          </div>

          <div class="pdp-actions">
            <button class="btn btn--ink" id="addToCart"><span>Add to Bag</span></button>
            <button class="btn" id="buyNow"><span>Buy Now</span></button>
          </div>

          <div class="pdp-shipping">
            <span>Free worldwide shipping over $300</span>
            <span>Made-to-order, ships in 5–7 days</span>
            <span>Free returns within 30 days</span>
          </div>

          <div class="pdp-acc">
            <button class="pdp-acc__head">Composition & Care</button>
            <div class="pdp-acc__body">${product.composition}. Dry clean only. Store on a padded hanger. Steam to refresh between wears — do not iron directly.</div>
          </div>
          <div class="pdp-acc">
            <button class="pdp-acc__head">Fit Notes</button>
            <div class="pdp-acc__body">Model is 178 cm and wears size S. Runs true to size; if between sizes, size up for a draped silhouette or down for a sculpted fit.</div>
          </div>
          <div class="pdp-acc">
            <button class="pdp-acc__head">Atelier Notes</button>
            <div class="pdp-acc__body">Cut and sewn in our Paris atelier. Each piece passes nine inspection points before shipping. Stitch density: 14 per inch. Buttons are mother-of-pearl.</div>
          </div>
        </aside>
      </div>

      <div class="pdp-toast" id="pdpToast">Added to bag</div>
    `;

    bind();
  }

  function bind() {
    root.querySelectorAll('.pdp-thumb').forEach(t => {
      t.addEventListener('click', () => {
        activeImg = parseInt(t.dataset.i);
        root.querySelectorAll('.pdp-thumb').forEach(x => x.classList.toggle('is-active', x === t));
        root.querySelectorAll('.pdp-gallery__main-img').forEach(x => {
          x.classList.toggle('is-active', parseInt(x.dataset.i) === activeImg);
        });
      });
    });

    root.querySelectorAll('.pdp-size').forEach(b => {
      b.addEventListener('click', () => {
        activeSize = b.dataset.size;
        root.querySelectorAll('.pdp-size').forEach(x => x.classList.toggle('is-active', x === b));
      });
    });

    root.querySelectorAll('.pdp-acc__head').forEach(h => {
      h.addEventListener('click', () => {
        h.parentElement.classList.toggle('is-open');
      });
    });

    document.getElementById('addToCart').addEventListener('click', () => {
      window.ElanCart.addToCart(product.id, activeSize, 1);
      const toast = document.getElementById('pdpToast');
      toast.classList.add('is-show');
      setTimeout(() => toast.classList.remove('is-show'), 1800);
    });

    document.getElementById('buyNow').addEventListener('click', () => {
      window.ElanCart.addToCart(product.id, activeSize, 1);
      location.href = 'checkout.html';
    });
  }

  render();

  // Related
  if (related) {
    const others = window.PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);
    related.innerHTML = others.map(p => `
      <a class="product-card reveal" href="product.html?id=${p.id}">
        <div class="product-card__media">
          ${p.badge ? `<span class="product-card__badge">${p.badge}</span>` : ''}
          <div class="product-card__img product-card__img--main" style="background-image:url('${p.images[0]}')"></div>
          <div class="product-card__img product-card__img--alt" style="background-image:url('${p.images[1] || p.images[0]}')"></div>
          <span class="product-card__quick">View Piece →</span>
        </div>
        <div class="product-card__info">
          <div>
            <div class="product-card__name">${p.name}</div>
            <div class="product-card__cat">${p.category} · ${p.color}</div>
          </div>
          <div class="product-card__price">${window.formatPrice(p.price)}</div>
        </div>
      </a>
    `).join('');

    document.querySelectorAll('.pdp-related .reveal').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.08) + 's';
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      obs.observe(el);
    });
  }
})();
