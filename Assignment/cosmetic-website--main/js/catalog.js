// ===== LISTING PAGE =====

const API_URL = 'https://dummyjson.com/products?limit=194';
let allProducts = [];
let filtered = [];

// --- Star rating helper ---
function stars(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

// --- Original price (before discount) ---
function originalPrice(price, discount) {
  return (price / (1 - discount / 100)).toFixed(2);
}

// --- Build one product card ---
function buildCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.id = product.id;

  const orig = originalPrice(product.price, product.discountPercentage);
  const inCart = Cart.getAll().some(i => i.id === product.id);

  card.innerHTML = `
    <div class="card-img-wrap">
      <img src="${product.thumbnail}" alt="${product.title}" loading="lazy" />
    </div>
    <div class="card-body">
      <span class="card-badge">${product.category}</span>
      <p class="card-title">${product.title}</p>
      <p class="card-rating">
        <span class="stars">${stars(product.rating)}</span>
        ${product.rating} (${product.stock} in stock)
      </p>
    </div>
    <div class="card-footer">
      <div class="card-price">
        $${product.price}
        <span class="original-price">$${orig}</span>
      </div>
      <button class="add-cart-btn ${inCart ? 'added' : ''}" data-id="${product.id}">
        ${inCart ? '✓ Added' : '+ Cart'}
      </button>
    </div>
  `;

  // Click card → product page (not the button)
  card.addEventListener('click', (e) => {
    if (!e.target.classList.contains('add-cart-btn')) {
      window.location.href = `product.html?id=${product.id}`;
    }
  });

  // Add to cart button
  card.querySelector('.add-cart-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    Cart.addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      category: product.category
    });
    e.target.textContent = '✓ Added';
    e.target.classList.add('added');
  });

  return card;
}

// --- Render grid ---
function renderGrid(products) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  if (products.length === 0) {
    grid.innerHTML = '<div class="loader">No products found.</div>';
    return;
  }

  products.forEach(p => grid.appendChild(buildCard(p)));
  document.getElementById('productCount').textContent = `${products.length} products`;
}

// --- Populate category dropdown ---
function populateCategories(products) {
  const select = document.getElementById('categoryFilter');
  const cats = [...new Set(products.map(p => p.category))].sort();
  cats.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    select.appendChild(opt);
  });
}

// --- Filter + sort ---
function applyFilters() {
  const search = document.getElementById('searchInput').value.toLowerCase().trim();
  const category = document.getElementById('categoryFilter').value;
  const sort = document.getElementById('sortFilter').value;

  filtered = allProducts.filter(p => {
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search);
    const matchCat = !category || p.category === category;
    return matchSearch && matchCat;
  });

  if (sort === 'price-asc')  filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sort === 'rating')     filtered.sort((a, b) => b.rating - a.rating);

  renderGrid(filtered);
}

// --- Fetch & init ---
(async function init() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    allProducts = data.products;
    filtered = allProducts;

    populateCategories(allProducts);
    renderGrid(allProducts);

    // Events
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('sortFilter').addEventListener('change', applyFilters);

    document.getElementById('productCount').textContent = `${allProducts.length} products`;
  } catch (err) {
    document.getElementById('productGrid').innerHTML =
      '<div class="loader">⚠️ Failed to load products. Please try again.</div>';
  }
})();