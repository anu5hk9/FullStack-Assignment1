// ===== SHARED CART UTILITIES =====

const Cart = {
  getAll() {
    return JSON.parse(localStorage.getItem('shopzone_cart') || '[]');
  },
  save(items) {
    localStorage.setItem('shopzone_cart', JSON.stringify(items));
    Cart.updateBadge();
  },
  addItem(product) {
    const items = Cart.getAll();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ ...product, qty: 1 });
    }
    Cart.save(items);
  },
  removeItem(id) {
    const items = Cart.getAll().filter(i => i.id !== id);
    Cart.save(items);
  },
  updateQty(id, qty) {
    const items = Cart.getAll();
    const item = items.find(i => i.id === id);
    if (item) {
      item.qty = qty;
      if (item.qty <= 0) return Cart.removeItem(id);
    }
    Cart.save(items);
  },
  totalItems() {
    return Cart.getAll().reduce((sum, i) => sum + i.qty, 0);
  },
  updateBadge() {
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = Cart.totalItems();
  }
};

// Update badge on load
document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());