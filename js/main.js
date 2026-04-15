/* ═══════════════════════════════════════════
   CASTLEVANIA — script.js
   Authentication · Products · Cart · Checkout
═══════════════════════════════════════════ */

'use strict';

/* ─── PRODUCT DATABASE ─── */
const PRODUCTS = [
  // MERCH (4)
  {
    id: 1, cat: 'merch', name: 'Velvet Dread Coat',
    price: 3800,
    desc: 'Floor-length velvet overcoat in obsidian black with blood-red satin lining and antiqued silver buttons.',
    img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80'
  },
  {
    id: 2, cat: 'merch', name: 'Shadow Lace Corset',
    price: 1950,
    desc: 'Victorian-inspired lace corset with boning channels and adjustable crimson ribbon ties.',
    img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80'
  },
  {
    id: 3, cat: 'merch', name: 'Nocturne Poet Shirt',
    price: 1200,
    desc: 'Billowing white cotton shirt with deep ruched cuffs and a dramatic open collar. Gothic romance in fabric.',
    img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80'
  },
  {
    id: 4, cat: 'merch', name: 'Bloodmoon Trousers',
    price: 1650,
    desc: 'Wide-leg tailored trousers in charcoal herringbone with a high waist and bone-carved buttons.',
    img: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600&q=80'
  },

  // MUSIC (4)
  {
    id: 5, cat: 'music', name: 'Covenant — Abyss (180g Vinyl)',
    price: 890,
    desc: 'Double gatefold 180-gram pressing of the landmark gothic synth opus. Deep red translucent wax.',
    img: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&q=80'
  },
  {
    id: 6, cat: 'music', name: 'Eternal Darkness — Requiem (CD)',
    price: 420,
    desc: 'Special edition CD in a hard-cover digibook with 32-page booklet and embossed silver cover art.',
    img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80'
  },
  {
    id: 7, cat: 'music', name: 'The Séance Tapes (Cassette Box)',
    price: 650,
    desc: 'Limited box set of 3 cassettes with original field recordings from abandoned cathedrals. Numbered.',
    img: 'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?w=600&q=80'
  },
  {
    id: 8, cat: 'music', name: 'Shadows Eternal — Anthology (5xLP)',
    price: 2400,
    desc: 'Five-disc anthology spanning the legendary 1987–2003 discography. Pressed on black and silver vinyl.',
    img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80'
  },

  // ACCESSORIES (4)
  {
    id: 9, cat: 'accessories', name: 'Obsidian Coffin Ring',
    price: 780,
    desc: 'Sterling silver ring set with a hand-cut obsidian cabochon in a miniature coffin bezel. Sizes 5–12.',
    img: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80'
  },
  {
    id: 10, cat: 'accessories', name: 'Vampire Choker Necklace',
    price: 560,
    desc: 'Black velvet choker with a drop pendant of blood-red garnet encased in oxidized silver claws.',
    img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80'
  },
  {
    id: 11, cat: 'accessories', name: 'Mourning Brooch (Skull)',
    price: 490,
    desc: 'Victorian mourning-style brooch. Hand-cast skull in pewter with jet glass eyes. Pin closure.',
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80'
  },
  {
    id: 12, cat: 'accessories', name: 'Grimoire Leather Wallet',
    price: 840,
    desc: 'Full-grain black leather bifold wallet tooled with occult sigils. Hand-stitched in crimson thread.',
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80'
  },

  // EXTRAS (4)
  {
    id: 13, cat: 'extras', name: 'The Book of Shadows (Grimoire)',
    price: 1100,
    desc: 'Hand-bound blank grimoire in aged leather with brass clasps. 256 pages of aged parchment paper.',
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80'
  },
  {
    id: 14, cat: 'extras', name: 'Cathedral Candle Set',
    price: 620,
    desc: 'Set of 6 hand-poured beeswax pillar candles in varying heights. Scented with dark amber and incense.',
    img: 'https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?w=600&q=80'
  },
  {
    id: 15, cat: 'extras', name: 'Tarot of the Undead (78-Card Deck)',
    price: 950,
    desc: 'Original gothic tarot deck illustrated by Romanian artist Mihaela Sorescu. Includes velvet drawstring bag.',
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80'
  },
  {
    id: 16, cat: 'extras', name: 'Pendulum of the Crypt',
    price: 380,
    desc: 'Antique-style brass pendulum with a black tourmaline point. Used for divination and ritual ceremony.',
    img: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80'
  }
];

/* ─── STATE ─── */
let cart = JSON.parse(localStorage.getItem('cv_cart') || '[]');
let currentFilter = 'all';

/* ═══════════════════════════════════════════
   AUTH
═══════════════════════════════════════════ */
function isAuthenticated() {
  return !!localStorage.getItem('cv_user');
}

function init() {
  if (isAuthenticated()) {
    showMainSite();
  } else {
    document.getElementById('gate').style.display = 'flex';
    document.getElementById('main-site').classList.add('hidden');
  }
}

function showMainSite() {
  document.getElementById('gate').style.display = 'none';
  document.getElementById('main-site').classList.remove('hidden');
  renderProducts('all');
  updateCartCount();
  initScrollObserver();
  initNavbarScroll();
}

function switchTab(tab) {
  document.querySelectorAll('.gate-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.gate-form').forEach(f => f.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.getElementById('form-' + tab).classList.add('active');
}

function handleLogin() {
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl    = document.getElementById('login-error');
  errEl.classList.add('hidden');

  if (!email || !password) {
    errEl.textContent = 'Both fields are required.';
    errEl.classList.remove('hidden');
    return;
  }
  if (!validateEmail(email)) {
    errEl.textContent = 'Please enter a valid email address.';
    errEl.classList.remove('hidden');
    return;
  }

  const users = JSON.parse(localStorage.getItem('cv_users') || '[]');
  const user  = users.find(u => u.email === email && u.password === password);

  if (!user) {
    errEl.textContent = 'Invalid credentials. Have you registered?';
    errEl.classList.remove('hidden');
    return;
  }

  localStorage.setItem('cv_user', JSON.stringify(user));
  showMainSite();
}

function handleRegister() {
  const name     = document.getElementById('reg-name').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const errEl    = document.getElementById('reg-error');
  errEl.classList.add('hidden');

  if (!name || !email || !password) {
    errEl.textContent = 'All fields are required.';
    errEl.classList.remove('hidden');
    return;
  }
  if (!validateEmail(email)) {
    errEl.textContent = 'Please enter a valid email address.';
    errEl.classList.remove('hidden');
    return;
  }
  if (password.length < 6) {
    errEl.textContent = 'Password must be at least 6 characters.';
    errEl.classList.remove('hidden');
    return;
  }

  const users = JSON.parse(localStorage.getItem('cv_users') || '[]');
  if (users.find(u => u.email === email)) {
    errEl.textContent = 'An account with this email already exists.';
    errEl.classList.remove('hidden');
    return;
  }

  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem('cv_users', JSON.stringify(users));
  localStorage.setItem('cv_user', JSON.stringify(newUser));
  showMainSite();
}

function handleLogout() {
  localStorage.removeItem('cv_user');
  cart = [];
  saveCart();
  location.reload();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ═══════════════════════════════════════════
   NAVBAR & SCROLL
═══════════════════════════════════════════ */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
}

/* ═══════════════════════════════════════════
   INTERSECTION OBSERVER (reveal animations)
═══════════════════════════════════════════ */
function initScrollObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════
   PRODUCTS
═══════════════════════════════════════════ */
function renderProducts(cat) {
  const grid = document.getElementById('products-grid');
  const list = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat);
  grid.innerHTML = list.map(productCardHTML).join('');
}

function filterProducts(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

function filterCategory(cat) {
  document.getElementById('bestsellers').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    const btn = document.querySelector(`.filter-btn[data-cat="${cat}"]`);
    if (btn) filterProducts(cat, btn);
  }, 600);
}

function productCardHTML(p) {
  const catLabels = { merch: 'Merch', music: "CD's & Vinyls", accessories: 'Accessories', extras: 'Extras' };
  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-card-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        <div class="product-quick-add">
          <button onclick="addToCart(${p.id})">Add to Vault</button>
        </div>
      </div>
      <div class="product-card-info">
        <div class="product-card-cat">${catLabels[p.cat]}</div>
        <div class="product-card-name">${p.name}</div>
        <div class="product-card-desc">${p.desc}</div>
        <div class="product-card-price">$${p.price.toLocaleString('es-MX')} MXN</div>
      </div>
    </div>
  `;
}

/* ─── LIVE SEARCH ─── */
function liveSearch(query) {
  const overlay = document.getElementById('search-results');
  const grid    = document.getElementById('search-results-grid');
  const q       = query.trim().toLowerCase();

  if (!q) {
    overlay.classList.add('hidden');
    return;
  }

  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.desc.toLowerCase().includes(q) ||
    p.cat.toLowerCase().includes(q)
  );

  overlay.classList.remove('hidden');
  grid.innerHTML = results.length
    ? results.map(productCardHTML).join('')
    : '<p style="color:var(--silver);font-style:italic;font-family:var(--font-serif);font-size:1.25rem;grid-column:1/-1;padding:2rem 0">No artifacts found in the vault.</p>';
}

function clearSearch() {
  document.getElementById('search-input').value = '';
  document.getElementById('search-results').classList.add('hidden');
}

/* ═══════════════════════════════════════════
   CART
═══════════════════════════════════════════ */
function saveCart() {
  localStorage.setItem('cv_cart', JSON.stringify(cart));
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }

  saveCart();
  updateCartCount();
  renderCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartCount();
  renderCart();
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cart-count').textContent = count;
}

function getCartTotal() {
  return cart.reduce((s, i) => {
    const p = PRODUCTS.find(p => p.id === i.id);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
}

function renderCart() {
  const el    = document.getElementById('cart-items');
  const empty = document.getElementById('cart-empty');
  const footer= document.getElementById('cart-footer');
  const total = document.getElementById('cart-total-price');

  if (!cart.length) {
    el.innerHTML = '';
    empty.classList.remove('hidden');
    footer.classList.add('hidden');
    return;
  }

  empty.classList.add('hidden');
  footer.classList.remove('hidden');
  total.textContent = '$' + getCartTotal().toLocaleString('es-MX') + ' MXN';

  el.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    if (!p) return '';
    return `
      <div class="cart-item">
        <div class="cart-item-img">
          <img src="${p.img}" alt="${p.name}" />
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">$${p.price.toLocaleString('es-MX')} MXN</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="updateQty(${p.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${p.id}, 1)">+</button>
            <button class="cart-item-remove" onclick="removeFromCart(${p.id})">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openCart() {
  renderCart();
  document.getElementById('cart-sidebar').classList.add('active');
  document.getElementById('cart-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function toggleCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  const isOpen  = sidebar.classList.contains('active');

  if (isOpen) {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  } else {
    openCart();
  }
}

/* ═══════════════════════════════════════════
   CHECKOUT
═══════════════════════════════════════════ */
function goToCheckout() {
  toggleCart();
  setTimeout(() => {
    document.getElementById('checkout-page').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    renderCheckoutSummary();
  }, 300);
}

function closeCheckout() {
  document.getElementById('checkout-page').classList.add('hidden');
  document.body.style.overflow = '';
}

function renderCheckoutSummary() {
  const list = document.getElementById('checkout-items-list');
  const sub  = document.getElementById('ck-subtotal');
  const tot  = document.getElementById('ck-total');
  const subtotal = getCartTotal();

  list.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    if (!p) return '';
    return `
      <div class="ck-item">
        <div class="ck-item-img"><img src="${p.img}" alt="${p.name}" /></div>
        <div class="ck-item-info">
          <div class="ck-item-name">${p.name}</div>
          <div class="ck-item-qty">Qty: ${item.qty}</div>
        </div>
        <div class="ck-item-price">$${(p.price * item.qty).toLocaleString('es-MX')}</div>
      </div>
    `;
  }).join('');

  sub.textContent = '$' + subtotal.toLocaleString('es-MX') + ' MXN';
  tot.textContent = '$' + (subtotal + 150).toLocaleString('es-MX') + ' MXN';

  const user = JSON.parse(localStorage.getItem('cv_user') || '{}');
  if (user.email) document.getElementById('ck-email').value = user.email;
  if (user.name)  document.getElementById('ck-name').value  = user.name;
}

function formatCard(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 2) v = v.substring(0, 2) + ' / ' + v.substring(2);
  input.value = v;
}

function processOrder() {
  const errEl = document.getElementById('checkout-error');
  errEl.classList.add('hidden');

  const name   = document.getElementById('ck-name').value.trim();
  const email  = document.getElementById('ck-email').value.trim();
  const addr   = document.getElementById('ck-address').value.trim();
  const city   = document.getElementById('ck-city').value.trim();
  const zip    = document.getElementById('ck-zip').value.trim();
  const card   = document.getElementById('ck-card').value.replace(/\s/g, '');
  const expiry = document.getElementById('ck-expiry').value.trim();
  const cvv    = document.getElementById('ck-cvv').value.trim();

  if (!name || !email || !addr || !city || !zip) {
    errEl.textContent = 'Please complete all shipping fields.';
    errEl.classList.remove('hidden');
    return;
  }
  if (!validateEmail(email)) {
    errEl.textContent = 'Please enter a valid email address.';
    errEl.classList.remove('hidden');
    return;
  }
  if (card.length < 16) {
    errEl.textContent = 'Please enter a valid 16-digit card number.';
    errEl.classList.remove('hidden');
    return;
  }
  if (!expiry.includes('/') || expiry.replace(/\s/g, '').length < 5) {
    errEl.textContent = 'Please enter a valid expiry date (MM / YY).';
    errEl.classList.remove('hidden');
    return;
  }
  if (cvv.length < 3) {
    errEl.textContent = 'Please enter a valid CVV.';
    errEl.classList.remove('hidden');
    return;
  }

  const orderId = 'CVN-' + Date.now().toString(36).toUpperCase();
  showOrderSuccess(orderId, name, city);
}

function showOrderSuccess(orderId, name, city) {
  closeCheckout();
  const total = getCartTotal() + 150;

  const receiptEl = document.getElementById('receipt');
  receiptEl.innerHTML = `
    <h4>Order Receipt</h4>
    ${cart.map(item => {
      const p = PRODUCTS.find(pr => pr.id === item.id);
      return p ? `<div class="receipt-row"><span>${p.name} ×${item.qty}</span><span>$${(p.price * item.qty).toLocaleString('es-MX')} MXN</span></div>` : '';
    }).join('')}
    <div class="receipt-row"><span>Shipping</span><span>$150 MXN</span></div>
    <div class="receipt-total"><span>Total Sealed</span><span>$${total.toLocaleString('es-MX')} MXN</span></div>
    <span class="receipt-id">Order ${orderId} · Dispatched to ${city}</span>
  `;

  document.getElementById('order-success').classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  cart = [];
  saveCart();
  updateCartCount();
}

function closeSuccess() {
  document.getElementById('order-success').classList.add('hidden');
  document.body.style.overflow = '';
  renderProducts(currentFilter);
}

/* ─── FAQ ─── */
function toggleFaq(btn) {
  const item   = btn.parentElement;
  const answer = item.querySelector('.faq-answer');
  const isOpen = btn.classList.contains('open');

  document.querySelectorAll('.faq-question.open').forEach(q => {
    q.classList.remove('open');
    q.parentElement.querySelector('.faq-answer').classList.remove('open');
  });

  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

/* ─── NEWSLETTER ─── */
function subscribeNewsletter() {
  const input = document.querySelector('.footer-subscribe input');
  const btn   = document.querySelector('.footer-subscribe button');
  if (!input.value.trim() || !validateEmail(input.value)) {
    input.style.borderColor = '#e05555';
    setTimeout(() => input.style.borderColor = '', 2000);
    return;
  }
  btn.textContent   = 'Welcomed';
  btn.style.background = '#1a4a1a';
  input.value = '';
  input.placeholder = 'You have joined the order.';
  setTimeout(() => {
    btn.textContent = 'Join';
    btn.style.background = '';
    input.placeholder = 'Your email address';
  }, 4000);
}

/* ─── BOOT ─── */
document.addEventListener('DOMContentLoaded', init);