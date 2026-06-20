// ÉLAN — Cart state management (localStorage)
const CART_KEY = 'elan_cart_v1';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
  window.dispatchEvent(new CustomEvent('cart:change', { detail: cart }));
}

function addToCart(productId, size, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.productId === productId && i.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ productId, size, qty });
  }
  saveCart(cart);
  flashCart();
}

function updateQty(productId, size, qty) {
  let cart = getCart();
  const item = cart.find(i => i.productId === productId && i.size === size);
  if (!item) return;
  item.qty = Math.max(0, qty);
  if (item.qty === 0) {
    cart = cart.filter(i => !(i.productId === productId && i.size === size));
  }
  saveCart(cart);
}

function removeFromCart(productId, size) {
  const cart = getCart().filter(i => !(i.productId === productId && i.size === size));
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const product = (window.PRODUCTS || []).find(p => p.id === item.productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartCount() {
  const count = getCartCount();
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.textContent = count;
    el.classList.toggle('is-empty', count === 0);
  });
}

function flashCart() {
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  });
}

if (typeof window !== 'undefined') {
  window.ElanCart = { getCart, saveCart, addToCart, updateQty, removeFromCart, clearCart, getCartTotal, getCartCount, updateCartCount };
  document.addEventListener('DOMContentLoaded', updateCartCount);
}
