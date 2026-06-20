// CHECKOUT — summary render, payment formatting, order placement
(function () {
  const summary = document.getElementById('checkoutSummary');
  const form = document.getElementById('checkoutForm');
  if (!summary || !form) return;

  const SHIPPING_FEE = 0; // standard free
  const RATES = { standard: 0, express: 24, atelier: 0 };
  let shipMethod = 'standard';

  function renderSummary() {
    const cart = window.ElanCart.getCart();
    if (cart.length === 0) {
      summary.innerHTML = `
        <h3>Your bag is empty.</h3>
        <p>Add a piece before checkout.</p>
        <a href="shop.html" class="btn btn--ink" style="width:100%; margin-top: 20px;"><span>Enter the Collection</span></a>`;
      document.getElementById('placeOrder').disabled = true;
      return;
    }

    const subtotal = window.ElanCart.getCartTotal();
    const shipping = RATES[shipMethod] ?? 0;
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + shipping + tax;

    summary.innerHTML = `
      <h3>Order Summary</h3>
      <div class="summary-list">
        ${cart.map(item => {
          const p = window.PRODUCTS.find(x => x.id === item.productId);
          if (!p) return '';
          return `
            <div class="summary-line">
              <div class="summary-line__img" style="background-image:url('${p.images[0]}')">
                <span class="summary-line__qty">${item.qty}</span>
              </div>
              <div>
                <div class="summary-line__name">${p.name}</div>
                <div class="summary-line__meta">${p.color} · Size ${item.size}</div>
              </div>
              <div class="summary-line__price">${window.formatPrice(p.price * item.qty)}</div>
            </div>`;
        }).join('')}
      </div>

      <div class="summary-promo">
        <input type="text" placeholder="Promo code" />
        <button type="button">Apply</button>
      </div>

      <div class="summary-totals">
        <div class="summary-row"><span>Subtotal</span><span>${window.formatPrice(subtotal)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : window.formatPrice(shipping)}</span></div>
        <div class="summary-row"><span>Estimated Tax</span><span>${window.formatPrice(tax)}</span></div>
        <div class="summary-row summary-row--total"><span>Total</span><span>${window.formatPrice(total)}</span></div>
      </div>`;
  }

  renderSummary();
  window.addEventListener('cart:change', renderSummary);

  // Shipping method change
  document.querySelectorAll('input[name="ship"]').forEach(r => {
    r.addEventListener('change', () => {
      if (r.checked) {
        shipMethod = r.value;
        renderSummary();
      }
    });
  });

  // Payment method tabs
  const payCard = document.getElementById('payCard');
  const payOther = document.getElementById('payOther');
  const payOtherName = document.getElementById('payOtherName');
  document.querySelectorAll('.pay-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.pay-tab').forEach(x => x.classList.toggle('is-active', x === t));
      const m = t.dataset.method;
      if (m === 'card') {
        payCard.hidden = false;
        payOther.hidden = true;
      } else {
        payCard.hidden = true;
        payOther.hidden = false;
        payOtherName.textContent = t.textContent.trim();
      }
    });
  });

  // Card formatting
  const cardNum = document.getElementById('cardNum');
  const cardBrand = document.getElementById('cardBrand');
  const cardExp = document.getElementById('cardExp');
  const cardCvc = document.getElementById('cardCvc');

  if (cardNum) {
    cardNum.addEventListener('input', () => {
      let v = cardNum.value.replace(/\D/g, '').slice(0, 16);
      cardNum.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
      let brand = '▲';
      if (v.startsWith('4')) brand = 'VISA';
      else if (/^(5[1-5]|2[2-7])/.test(v)) brand = 'MASTERCARD';
      else if (/^3[47]/.test(v)) brand = 'AMEX';
      else if (/^6/.test(v)) brand = 'DISCOVER';
      cardBrand.textContent = brand;
    });
  }

  if (cardExp) {
    cardExp.addEventListener('input', () => {
      let v = cardExp.value.replace(/\D/g, '').slice(0, 4);
      if (v.length > 2) v = v.slice(0, 2) + ' / ' + v.slice(2);
      cardExp.value = v;
    });
  }

  if (cardCvc) {
    cardCvc.addEventListener('input', () => {
      cardCvc.value = cardCvc.value.replace(/\D/g, '').slice(0, 4);
    });
  }

  // Validate & submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (window.ElanCart.getCart().length === 0) return;

    // Light validation
    const required = ['email', 'firstName', 'lastName', 'address', 'city', 'zip'];
    let valid = true;
    required.forEach(k => {
      const el = form.elements[k];
      if (el && !el.value.trim()) {
        el.classList.add('is-error');
        valid = false;
      } else if (el) {
        el.classList.remove('is-error');
      }
    });

    const activePay = document.querySelector('.pay-tab.is-active').dataset.method;
    if (activePay === 'card') {
      const num = cardNum.value.replace(/\s/g, '');
      if (num.length < 13) { cardNum.classList.add('is-error'); valid = false; }
      else cardNum.classList.remove('is-error');
      if (!cardExp.value || cardExp.value.length < 7) { cardExp.classList.add('is-error'); valid = false; }
      else cardExp.classList.remove('is-error');
      if (!cardCvc.value || cardCvc.value.length < 3) { cardCvc.classList.add('is-error'); valid = false; }
      else cardCvc.classList.remove('is-error');
    }

    if (!valid) {
      const first = form.querySelector('.is-error');
      if (first && window.elanLenis) {
        const r = first.getBoundingClientRect();
        window.elanLenis.scrollTo(window.scrollY + r.top - 120, { duration: 0.8 });
      }
      return;
    }

    // Simulate processing
    const proc = document.getElementById('processing');
    proc.classList.add('is-on');

    const subtotal = window.ElanCart.getCartTotal();
    const shipping = RATES[shipMethod] ?? 0;
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + shipping + tax;

    const order = {
      id: 'ELAN-' + Date.now().toString(36).toUpperCase(),
      email: form.elements.email.value,
      name: form.elements.firstName.value + ' ' + form.elements.lastName.value,
      address: form.elements.address.value + (form.elements.apt.value ? ', ' + form.elements.apt.value : ''),
      city: form.elements.city.value,
      zip: form.elements.zip.value,
      country: form.elements.country.value,
      shipping: shipMethod,
      payment: activePay,
      items: window.ElanCart.getCart().map(i => {
        const p = window.PRODUCTS.find(x => x.id === i.productId);
        return { id: i.productId, name: p?.name, color: p?.color, size: i.size, qty: i.qty, price: p?.price };
      }),
      subtotal, shippingFee: shipping, tax, total,
      placedAt: new Date().toISOString()
    };

    localStorage.setItem('elan_last_order', JSON.stringify(order));

    setTimeout(() => {
      window.ElanCart.clearCart();
      location.href = 'success.html';
    }, 2400);
  });
})();
