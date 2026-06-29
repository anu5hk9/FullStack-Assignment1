// ===== PRODUCT DETAIL PAGE =====

function stars(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function stockLabel(stock) {
  if (stock === 0) return '<span class="out-stock">Out of Stock</span>';
  if (stock < 10)  return `<span class="low-stock">Only ${stock} left!</span>`;
  return `<span class="in-stock">✓ In Stock (${stock})</span>`;
}

function originalPrice(price, discount) {
  return (price / (1 - discount / 100)).toFixed(2);
}

let qty = 1;

function renderProduct(p) {
  const orig = originalPrice(p.price, p.discountPercentage);
  const inCart = Cart.getAll().some(i => i.id === p.id);

  const wrapper = document.getElementById('productDetail');
  wrapper.innerHTML = `
    <div class="detail-card">
      <!-- Gallery -->
      <div class="detail-gallery">
        <img class="detail-main-img" id="mainImg"
          src="${p.images?.[0] || p.thumbnail}" alt="${p.title}" />
        <div class="detail-thumbs" id="thumbs">
          ${(p.images || [p.thumbnail]).map((img, i) => `
            <img src="${img}" alt="view ${i+1}"
              class="${i === 0 ? 'active' : ''}"
              data-src="${img}" />
          `).join('')}
        </div>
      </div>

      <!-- Info -->
      <div class="detail-info">
        <p class="detail-category">${p.category}</p>
        <h1 class="detail-title">${p.title}</h1>

        <div class="detail-rating">
          <span class="stars">${stars(p.rating)}</span>
          <span>${p.rating} / 5</span>
        </div>

        <div class="detail-price-row">
          <span class="detail-price">$${p.price}</span>
          <span class="detail-original">$${orig}</span>
          <span class="detail-discount">-${Math.round(p.discountPercentage)}%</span>
        </div>

        <div class="detail-stock">${stockLabel(p.stock)}</div>

        <p class="detail-description">${p.description}</p>

        <div class="detail-meta">
          <div class="detail-meta-item">
            <span class="label">Brand</span>
            <span class="value">${p.brand || '—'}</span>
          </div>
          <div class="detail-meta-item">
            <span class="label">SKU</span>
            <span class="value">${p.sku || p.id}</span>
          </div>
          <div class="detail-meta-item">
            <span class="label">Warranty</span>
            <span class="value">${p.warrantyInformation || '—'}</span>
          </div>
          <div class="detail-meta-item">
            <span class="label">Shipping</span>
            <span class="value">${p.shippingInformation || '—'}</span>
          </div>
        </div>

        <!-- Quantity -->
        <div class="qty-row">
          <button class="qty-btn" id="qtyMinus">−</button>
          <span class="qty-display" id="qtyDisplay">1</span>
          <button class="qty-btn" id="qtyPlus">+</button>
        </div>

        <button class="detail-add-btn ${inCart ? 'added' : ''}" id="addToCart">
          ${inCart ? '✓ Already in Cart' : '🛒 Add to Cart'}
        </button>
      </div>
    </div>
  `;

  // Thumbnail switching
  document.getElementById('thumbs').addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
      document.getElementById('mainImg').src = e.target.dataset.src;
      document.querySelectorAll('#thumbs img').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
    }
  });

  // Qty controls
  document.getElementById('qtyMinus').addEventListener('click', () => {
    if (qty > 1) { qty--; document.getElementById('qtyDisplay').textContent = qty; }
  });
  document.getElementById('qtyPlus').addEventListener('click', () => {
    if (qty < p.stock) { qty++; document.getElementById('qtyDisplay').textContent = qty; }
  });

  // Add to cart
  document.getElementById('addToCart').addEventListener('click', (e) => {
    for (let i = 0; i < qty; i++) {
      Cart.addItem({
        id: p.id,
        title: p.title,
        price: p.price,
        thumbnail: p.thumbnail,
        category: p.category
      });
    }
    e.target.textContent = '✓ Added to Cart';
    e.target.classList.add('added');
  });
}

// --- Init ---
(async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    window.location.href = 'index.html';
    return;
  }

  document.title = 'Loading… — ShopZone';

  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    const product = await res.json();
    document.title = `${product.title} — ShopZone`;
    renderProduct(product);
  } catch (err) {
    document.getElementById('productDetail').innerHTML =
      '<div class="loader">⚠️ Could not load product. <a href="index.html">Go back</a></div>';
  }
})();