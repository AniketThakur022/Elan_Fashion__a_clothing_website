// CART PAGE — full-page bag view
(function () {
  const root = document.getElementById('cartInner');
  if (!root) return;

  const SHIPPING_THRESHOLD = 300;
  const SHIPPING_FEE = 18;

  function render() {
    const cart = window.ElanCart.getCart();
    if (cart.length === 0) {
      root.innerHTML = `
        <div class="cart-empty" style="grid-column: 1 / -1;">
          <p class="eyebrow">Empty Bag</p>
          <h2>Your bag is quiet.</h2>
          <p style="color: var(--grey-2);">No pieces yet. Discover the AW26 collection.</p>
          <a href="shop.html" class="btn btn--ink"><span>Enter the Collection</span></a>
        </div>`;
      return;
    }
    const subtotal = window.ElanCart.getCartTotal();
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + shipping + tax;

    root.innerHTML = `
      <div class="cart-list">
        ${cart.map(item => {
          const p = window.PRODUCTS.find(x => x.id === item.productId);
          if (!p) return '';
          return `
            <div class="cart-row">
              <a class="cart-row__img" href="product.html?id=${p.id}" style="background-image:url('${p.images[0]}')"></a>
              <div>
                <a href="product.html?id=${p.id}"><div class="cart-row__name">${p.name}</div></a>
                <div class="cart-row__cat">${p.category}</div>
                <div class="cart-row__meta">
                  <span>Color · ${p.color}</span>
                  <span>Size · ${item.size}</span>
                  <span>${p.composition}</span>
                </div>
                <div style="display:flex; align-items:center;">
                  <div class="cart-row__qty">
                    <button data-act="dec" data-id="${p.id}" data-size="${item.size}">−</button>
                    <span>${item.qty}</span>
                    <button data-act="inc" data-id="${p.id}" data-size="${item.size}">+</button>
                  </div>
                  <button class="cart-row__remove" data-act="rm" data-id="${p.id}" data-size="${item.size}">Remove</button>
                </div>
              </div>
              <div class="cart-row__price-col">
                <div class="cart-row__price">${window.formatPrice(p.price * item.qty)}</div>
              </div>
            </div>`;
        }).join('')}
      </div>

      <aside class="cart-summary">
        <h2>Summary</h2>
        <div class="cart-summary__line"><span>Subtotal</span><span>${window.formatPrice(subtotal)}</span></div>
        <div class="cart-summary__line"><span>Shipping ${shipping === 0 ? '(free over $300)' : ''}</span><span>${shipping === 0 ? 'Free' : window.formatPrice(shipping)}</span></div>
        <div class="cart-summary__line"><span>Estimated Tax</span><span>${window.formatPrice(tax)}</span></div>
        <div class="cart-summary__line cart-summary__line--total"><span>Total</span><span>${window.formatPrice(total)}</span></div>
        <a href="checkout.html" class="btn btn--ink"><span>Proceed to Checkout</span></a>
        <a href="shop.html" class="btn"><span>Continue Shopping</span></a>
        <div class="cart-promo">
          <input type="text" placeholder="Promo code" />
          <button>Apply</button>
        </div>
        <p class="cart-summary__note">Secure checkout · Visa · Mastercard · Amex · Apple Pay</p>
      </aside>`;

    root.querySelectorAll('button[data-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id, size = btn.dataset.size, act = btn.dataset.act;
        const item = window.ElanCart.getCart().find(i => i.productId === id && i.size === size);
        if (!item) return;
        if (act === 'inc') window.ElanCart.updateQty(id, size, item.qty + 1);
        if (act === 'dec') window.ElanCart.updateQty(id, size, item.qty - 1);
        if (act === 'rm') window.ElanCart.removeFromCart(id, size);
        render();
      });
    });
  }

  render();
  window.addEventListener('cart:change', render);
})();
