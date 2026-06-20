// SHOP — filtering, sorting, product card render
(function () {
  const grid = document.getElementById('shopGrid');
  const filters = document.getElementById('shopFilters');
  const sortSel = document.getElementById('shopSort');
  if (!grid) return;

  const params = new URLSearchParams(location.search);
  let activeCat = params.get('cat') || 'All';
  let sort = 'featured';

  function renderFilters() {
    filters.innerHTML = window.CATEGORIES.map(c =>
      `<button class="shop-filter ${c === activeCat ? 'is-active' : ''}" data-cat="${c}">${c}</button>`
    ).join('');
    filters.querySelectorAll('.shop-filter').forEach(b => {
      b.addEventListener('click', () => {
        activeCat = b.dataset.cat;
        const url = new URL(location.href);
        if (activeCat === 'All') url.searchParams.delete('cat');
        else url.searchParams.set('cat', activeCat);
        history.replaceState(null, '', url);
        renderFilters();
        renderGrid();
      });
    });
  }

  function getProducts() {
    let list = window.PRODUCTS.slice();
    if (activeCat !== 'All') list = list.filter(p => p.category === activeCat);
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }

  function renderGrid() {
    const list = getProducts();
    if (list.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 80px 0; font-family: var(--font-display); font-size: 22px;">No pieces in this category yet.</div>`;
      return;
    }
    grid.innerHTML = list.map(p => `
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
      </a>`).join('');

    document.querySelectorAll('.shop-grid .reveal').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.05) + 's';
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

  if (sortSel) {
    sortSel.addEventListener('change', () => {
      sort = sortSel.value;
      renderGrid();
    });
  }

  renderFilters();
  renderGrid();
})();
