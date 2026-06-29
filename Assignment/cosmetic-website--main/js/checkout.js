// ===== CART PAGE =====

const DELIVERY_FEE = 40;
const DISCOUNT_RATE = 0.10;

function renderCart() {
  const items = Cart.getAll();
  const container = document.getElementById('cartItems');
  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty 🛒</h3>
        <p>Looks like you haven't added anything yet.</p>
        <a href="index.html">Start Shopping</a>
      </div>
    `;
    updateBill([]);
    return;
  }

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img class="cart-item-img" src="${item.thumbnail}" alt="${item.title}" />
      <div class="cart-item-info">
        <p class="cart-item-title">${item.title}</p>
        <p class="cart-item-cat">${item.category}</p>
        <p class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</p>
      </div>
      <div class="cart-item-controls">
        <div class="qty-control">
          <button class="qty-btn" data-id="${item.id}" data-action="dec">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-action="inc">+</button>
        </div>
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });

  // Qty buttons
  container.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const item = Cart.getAll().find(i => i.id === id);
      if (!item) return;
      const newQty = btn.dataset.action === 'inc' ? item.qty + 1 : item.qty - 1;
      Cart.updateQty(id, newQty);
      renderCart();
    });
  });

  // Remove buttons
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      Cart.removeItem(Number(btn.dataset.id));
      renderCart();
    });
  });

  updateBill(items);
}

function updateBill(items) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = subtotal * DISCOUNT_RATE;
  const total = subtotal - discount + (items.length > 0 ? DELIVERY_FEE : 0);

  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('discount').textContent  = `-$${discount.toFixed(2)}`;
  document.getElementById('delivery').textContent  = items.length > 0 ? `$${DELIVERY_FEE.toFixed(2)}` : '$0';
  document.getElementById('total').textContent     = `$${total.toFixed(2)}`;

  const btn = document.getElementById('checkoutBtn');
  if (btn) btn.disabled = items.length === 0;
}

// Checkout button
document.getElementById('checkoutBtn').addEventListener('click', () => {
  alert('🎉 Order placed successfully! Thank you for shopping at ShopZone.');
  localStorage.removeItem('shopzone_cart');
  Cart.updateBadge();
  renderCart();
});

// Init
renderCart();