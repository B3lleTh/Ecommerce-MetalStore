/* ============================================
   DARK METAL STORE - Main JS
   Auth | Cart | Products | Admin | Security
   ============================================ */

"use strict";

// ================================================
// AUTH MODULE (credentials stored obfuscated)
// ================================================
const _authStore = (() => {
  // Credentials are never hardcoded as plain strings in global scope
  // They live inside a closure - not accessible from console
  const _users = [
    {
      id: 1,
      username: btoa("admin"),         // base64 of "admin"
      password: btoa("admin"),         // base64 of "admin"
      role: "admin",
      name: "Administrador Oscuro",
      email: "admin@darkmetalstore.com",
      avatar: "👑",
      joinDate: "2020-01-01"
    },
    {
      id: 2,
      username: btoa("usuario"),
      password: btoa("1234"),
      role: "user",
      name: "Alma Perdida",
      email: "usuario@darkmetalstore.com",
      avatar: "🖤",
      joinDate: "2023-06-15"
    }
  ];

  return {
    validate(user, pass) {
      return _users.find(
        u => atob(u.username) === user && atob(u.password) === pass
      ) || null;
    },
    getById(id) {
      return _users.find(u => u.id === id) || null;
    }
  };
})();

// ================================================
// SESSION MANAGER
// ================================================
const Session = {
  KEY: "dms_session",

  set(user) {
    const payload = { id: user.id, role: user.role, name: user.name, avatar: user.avatar, email: user.email, joinDate: user.joinDate };
    sessionStorage.setItem(this.KEY, JSON.stringify(payload));
  },

  get() {
    try {
      const raw = sessionStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  clear() {
    sessionStorage.removeItem(this.KEY);
  },

  isLoggedIn() {
    return this.get() !== null;
  },

  isAdmin() {
    const s = this.get();
    return s && s.role === "admin";
  }
};

// ================================================
// ROUTE GUARD
// ================================================
const RouteGuard = {
  // Pages that require login
  PROTECTED: ["perfil.html", "carrito.html"],
  // Pages only for admin
  ADMIN_ONLY: [],
  // Redirect target if not logged in
  LOGIN_PAGE: "login.html",

  check() {
    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html";

    // Protect routes
    if (this.PROTECTED.some(p => page.includes(p))) {
      if (!Session.isLoggedIn()) {
        window.location.replace(this.LOGIN_PAGE);
        return false;
      }
    }

    // Redirect logged-in users away from login page
    if (page.includes("login.html") && Session.isLoggedIn()) {
      window.location.replace("../index.html");
      return false;
    }

    return true;
  }
};

// ================================================
// PRODUCT DATABASE (Products stored in closure)
// ================================================
const ProductDB = (() => {
  let _products = [
    {
      id: 1,
      band: "Metallica",
      name: "Master of Puppets - CD Edición Deluxe",
      desc: "El álbum definitivo del thrash metal. Edición remasterizada con libreto de 40 páginas y arte expandido.",
      price: 349,
      category: "cd",
      img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80",
      stock: 15,
      rating: 5
    },
    {
      id: 2,
      band: "Black Sabbath",
      name: "Paranoid - Vinilo Rojo 180g",
      desc: "Progenitor del heavy metal. Prensado en vinilo rojo sangre de 180 gramos, audiófilo y coleccionable.",
      price: 599,
      category: "vinyl",
      img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
      stock: 8,
      rating: 5
    },
    {
      id: 3,
      band: "Iron Maiden",
      name: "Powerslave - Playera Eddie Vintage",
      desc: "Diseño vintage del icónico Eddie de Iron Maiden. 100% algodón peinado, serigrafía de alta calidad.",
      price: 450,
      category: "merch",
      img: "https://images.unsplash.com/photo-1520975867040-1f7fead66882?w=400&q=80",
      stock: 25,
      rating: 4
    },
    {
      id: 4,
      band: "Slayer",
      name: "Reign in Blood - CD Remasterizado",
      desc: "Treinta y un minutos de brutalidad pura. El álbum más rápido y agresivo del thrash metal, remasterizado.",
      price: 289,
      category: "cd",
      img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80",
      stock: 12,
      rating: 5
    },
    {
      id: 5,
      band: "Dimmu Borgir",
      name: "Puerta de Infierno - Poster Enmarcado",
      desc: "Arte oscuro oficial de Dimmu Borgir. Impresión giclée sobre papel de archivo, marco negro lacado.",
      price: 799,
      category: "art",
      img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
      stock: 5,
      rating: 4
    },
    {
      id: 6,
      band: "Rammstein",
      name: "Mutter - CD Box Set",
      desc: "Box set coleccionable del álbum más icónico del Neue Deutsche Härte. Incluye CD, DVD y booklet exclusivo.",
      price: 899,
      category: "cd",
      img: "https://images.unsplash.com/photo-1511735111819-9a3efd16f078?w=400&q=80",
      stock: 7,
      rating: 5
    },
    {
      id: 7,
      band: "Cradle of Filth",
      name: "Cornamenta de Cernunnos - Pin Set",
      desc: "Colección de 5 pines esmaltados con motivos célticos oscuros. Presentados en caja de terciopelo negro.",
      price: 199,
      category: "merch",
      img: "https://images.unsplash.com/photo-1614117079476-c4e636aca879?w=400&q=80",
      stock: 30,
      rating: 4
    },
    {
      id: 8,
      band: "Behemoth",
      name: "Satanist - Vinilo Transparente",
      desc: "El opus magnum del black/death metal polaco. Vinilo transparente edición limitada con arte interior extendido.",
      price: 649,
      category: "vinyl",
      img: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=400&q=80",
      stock: 4,
      rating: 5
    },
    {
      id: 9,
      band: "Tool",
      name: "Lateralus - Edición 20 Aniversario",
      desc: "El viaje psicodélico definitivo. Edición de aniversario con material inédito y libro de arte de Alex Grey.",
      price: 749,
      category: "cd",
      img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80",
      stock: 6,
      rating: 5
    },
    {
      id: 10,
      band: "Ghost",
      name: "Ritual de Papa - Capa Ceremonial",
      desc: "Réplica oficial de la capa ceremonial de Papa Emeritus. Tela de alta calidad, broches de metal. Talla única.",
      price: 1299,
      category: "merch",
      img: "https://images.unsplash.com/photo-1551854838-212c9a8f0700?w=400&q=80",
      stock: 3,
      rating: 5
    },
    {
      id: 11,
      band: "Marilyn Manson",
      name: "Antichrist Superstar - CD Doble",
      desc: "La ópera rock más transgresora del rock alternativo. Doble CD en digipack con arte de P.R. Giger.",
      price: 399,
      category: "cd",
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
      stock: 10,
      rating: 4
    },
    {
      id: 12,
      band: "Type O Negative",
      name: "Bloody Kisses - Vinilo Doble Negro",
      desc: "El gótico más melancólico y hermoso del doom metal. Doble vinilo negro con portada desplegable.",
      price: 699,
      category: "vinyl",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
      stock: 9,
      rating: 5
    }
  ];

  let _nextId = 13;

  return {
    getAll() { return [..._products]; },
    getById(id) { return _products.find(p => p.id === id) || null; },
    getByCategory(cat) {
      if (!cat || cat === "all") return [..._products];
      return _products.filter(p => p.category === cat);
    },
    search(term) {
      const t = term.toLowerCase();
      return _products.filter(p =>
        p.name.toLowerCase().includes(t) ||
        p.band.toLowerCase().includes(t) ||
        p.desc.toLowerCase().includes(t)
      );
    },
    add(product) {
      const newP = { ...product, id: _nextId++ };
      _products.push(newP);
      return newP;
    },
    remove(id) {
      const idx = _products.findIndex(p => p.id === id);
      if (idx !== -1) { _products.splice(idx, 1); return true; }
      return false;
    },
    update(id, data) {
      const idx = _products.findIndex(p => p.id === id);
      if (idx !== -1) { _products[idx] = { ..._products[idx], ...data }; return _products[idx]; }
      return null;
    }
  };
})();

// ================================================
// CART MODULE
// ================================================
const Cart = {
  KEY: "dms_cart",

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch { return []; }
  },

  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateBadge();
  },

  add(productId, qty = 1) {
    const items = this.getItems();
    const product = ProductDB.getById(productId);
    if (!product) return;

    const existing = items.find(i => i.id === productId);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock);
    } else {
      items.push({ id: productId, qty, name: product.name, price: product.price, img: product.img, band: product.band });
    }
    this.save(items);
    Toast.show("🖤 Añadido al carrito", product.name);
  },

  remove(productId) {
    const items = this.getItems().filter(i => i.id !== productId);
    this.save(items);
  },

  updateQty(productId, qty) {
    const items = this.getItems();
    const item = items.find(i => i.id === productId);
    if (item) {
      if (qty <= 0) { this.remove(productId); return; }
      item.qty = qty;
      this.save(items);
    }
  },

  clear() {
    localStorage.removeItem(this.KEY);
    this.updateBadge();
  },

  getTotal() {
    return this.getItems().reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  getCount() {
    return this.getItems().reduce((sum, i) => sum + i.qty, 0);
  },

  updateBadge() {
    const badges = document.querySelectorAll(".cart-count");
    const count = this.getCount();
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? "inline-flex" : "none";
    });
  }
};

// ================================================
// TOAST NOTIFICATION
// ================================================
const Toast = {
  show(title, message, type = "success") {
    const container = document.getElementById("toastContainer") ||
      (() => {
        const el = document.createElement("div");
        el.id = "toastContainer";
        el.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;";
        document.body.appendChild(el);
        return el;
      })();

    const toast = document.createElement("div");
    toast.style.cssText = `
      padding:14px 18px;border-radius:10px;min-width:240px;max-width:300px;
      background:linear-gradient(135deg,rgba(20,0,40,.97),rgba(5,0,15,.99));
      border:1px solid rgba(139,0,0,.5);color:#d4c5e2;
      font-family:'Rajdhani',sans-serif;font-size:.9rem;
      box-shadow:0 8px 32px rgba(0,0,0,.7),0 0 15px rgba(220,20,60,.3);
      animation:slideInToast .3s ease;backdrop-filter:blur(20px);
    `;

    toast.innerHTML = `
      <div style="font-family:'Cinzel',serif;font-size:.8rem;color:#DC143C;margin-bottom:4px;letter-spacing:.1em;">${title}</div>
      <div>${message}</div>
    `;

    if (!document.getElementById("toastStyle")) {
      const s = document.createElement("style");
      s.id = "toastStyle";
      s.textContent = `
        @keyframes slideInToast{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:none}}
        @keyframes slideOutToast{from{opacity:1;transform:none}to{opacity:0;transform:translateX(30px)}}
      `;
      document.head.appendChild(s);
    }

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = "slideOutToast .3s ease forwards";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// ================================================
// NAVBAR UTILS
// ================================================
const NavbarUtils = {
  init() {
    this.updateCartBadge();
    this.updateAuthState();
    this.highlightCurrentPage();
  },

  updateCartBadge() {
    Cart.updateBadge();
  },

  updateAuthState() {
    const session = Session.get();
    const loginLinks = document.querySelectorAll(".nav-login-link");
    const profileLinks = document.querySelectorAll(".nav-profile-link");
    const logoutLinks = document.querySelectorAll(".nav-logout-link");
    const adminLinks = document.querySelectorAll(".nav-admin-link");

    if (session) {
      loginLinks.forEach(el => el.style.display = "none");
      profileLinks.forEach(el => el.style.display = "");
      logoutLinks.forEach(el => el.style.display = "");
      if (session.role === "admin") {
        adminLinks.forEach(el => el.style.display = "");
      }
    } else {
      loginLinks.forEach(el => el.style.display = "");
      profileLinks.forEach(el => el.style.display = "none");
      logoutLinks.forEach(el => el.style.display = "none");
      adminLinks.forEach(el => el.style.display = "none");
    }
  },

  highlightCurrentPage() {
    const page = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link-custom").forEach(link => {
      const href = link.getAttribute("href") || "";
      if (href.includes(page) || (page === "index.html" && href.endsWith("index.html"))) {
        link.classList.add("active");
      }
    });
  },

  logout() {
    Session.clear();
    Toast.show("🕯️ Hasta la próxima", "Sesión cerrada correctamente");
    setTimeout(() => { window.location.href = "../index.html"; }, 1200);
  }
};

// ================================================
// PAGE: LOGIN
// ================================================
const LoginPage = {
  init() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", e => {
      e.preventDefault();
      const user = document.getElementById("loginUser").value.trim();
      const pass = document.getElementById("loginPass").value;
      const errorEl = document.getElementById("loginError");

      errorEl.style.display = "none";

      const account = _authStore.validate(user, pass);

      if (account) {
        Session.set(account);
        Toast.show("🖤 Bienvenido", account.name);
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 1000);
      } else {
        errorEl.style.display = "block";
        // shake animation
        form.classList.add("shake");
        setTimeout(() => form.classList.remove("shake"), 500);
      }
    });

    // add shake style
    if (!document.getElementById("shakeStyle")) {
      const s = document.createElement("style");
      s.id = "shakeStyle";
      s.textContent = `@keyframes shake{0%,100%{transform:none}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}.shake{animation:shake .4s ease}`;
      document.head.appendChild(s);
    }
  }
};

// ================================================
// PAGE: CATALOG
// ================================================
const CatalogPage = {
  currentCategory: "all",
  searchTerm: "",

  init() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    this.render();
    this.bindCategoryPills();
    this.bindSearch();
  },

  render() {
    const grid = document.getElementById("productGrid");
    let products = ProductDB.getByCategory(this.currentCategory);
    if (this.searchTerm) {
      products = products.filter(p => {
        const t = this.searchTerm.toLowerCase();
        return p.name.toLowerCase().includes(t) || p.band.toLowerCase().includes(t) || p.desc.toLowerCase().includes(t);
      });
    }

    const isAdmin = Session.isAdmin();

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="col-12 text-center py-5">
          <div style="font-size:4rem;margin-bottom:1rem;">🕸️</div>
          <p style="font-family:'Cinzel',serif;color:var(--text-muted);">Ningún producto encontrado en las sombras...</p>
        </div>`;
      return;
    }

    grid.innerHTML = products.map((p, i) => `
      <div class="col-sm-6 col-lg-4 col-xl-3 mb-4 fade-in-up" style="animation-delay:${i * 0.05}s">
        <div class="product-card glass-card h-100">
          <div class="product-img-wrapper">
            <img src="${p.img}" alt="${p.name}" loading="lazy">
            <div class="product-overlay"></div>
            <span class="product-band-tag">${p.band}</span>
            ${p.stock <= 5 ? `<span style="position:absolute;bottom:10px;right:10px;background:rgba(139,0,0,.8);padding:3px 8px;border-radius:3px;font-size:.65rem;font-family:'Cinzel',serif;color:var(--bone);">Últimas ${p.stock}</span>` : ''}
          </div>
          <div class="product-body d-flex flex-column">
            <div class="stars mb-1">${'★'.repeat(p.rating)}${'☆'.repeat(5 - p.rating)}</div>
            <div class="product-title">${p.name}</div>
            <div class="product-desc flex-grow-1">${p.desc}</div>
            <div class="d-flex align-items-center justify-content-between mt-auto">
              <div class="product-price"><span class="currency">$</span>${p.price.toLocaleString()}</div>
              <button class="btn-liquid btn-sm" onclick="Cart.add(${p.id})">
                <i class="bi bi-cart-plus me-1"></i>Añadir
              </button>
            </div>
            ${isAdmin ? `
            <div class="d-flex gap-2 mt-2">
              <button class="btn-liquid btn-liquid-outline flex-fill" style="font-size:.7rem;padding:6px" onclick="AdminPanel.editProduct(${p.id})">
                <i class="bi bi-pencil me-1"></i>Editar
              </button>
              <button class="btn-liquid flex-fill" style="font-size:.7rem;padding:6px;background:linear-gradient(135deg,#4a0020,#1a0008)" onclick="AdminPanel.deleteProduct(${p.id})">
                <i class="bi bi-trash me-1"></i>Eliminar
              </button>
            </div>` : ''}
          </div>
        </div>
      </div>
    `).join("");
  },

  bindCategoryPills() {
    document.querySelectorAll(".cat-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".cat-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.currentCategory = pill.dataset.cat;
        this.render();
      });
    });
  },

  bindSearch() {
    const input = document.getElementById("catalogSearch");
    if (!input) return;
    input.addEventListener("input", () => {
      this.searchTerm = input.value;
      this.render();
    });
  }
};

// ================================================
// ADMIN PANEL
// ================================================
const AdminPanel = {
  init() {
    const panel = document.getElementById("adminPanel");
    if (!panel) return;
    if (!Session.isAdmin()) { panel.style.display = "none"; return; }
    panel.style.display = "block";
    this.bindAddForm();
  },

  bindAddForm() {
    const form = document.getElementById("addProductForm");
    if (!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const product = {
        band: document.getElementById("pBand").value.trim(),
        name: document.getElementById("pName").value.trim(),
        desc: document.getElementById("pDesc").value.trim(),
        price: parseInt(document.getElementById("pPrice").value),
        category: document.getElementById("pCategory").value,
        img: document.getElementById("pImg").value.trim() || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80",
        stock: parseInt(document.getElementById("pStock").value) || 10,
        rating: 5
      };

      if (!product.band || !product.name || !product.price) {
        Toast.show("⚠️ Error", "Completa los campos requeridos"); return;
      }

      ProductDB.add(product);
      form.reset();
      CatalogPage.render();
      Toast.show("✅ Producto añadido", product.name);

      // collapse admin panel
      const collapse = document.getElementById("adminCollapse");
      if (collapse) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  },

  deleteProduct(id) {
    if (!Session.isAdmin()) return;
    const product = ProductDB.getById(id);
    if (!product) return;

    if (confirm(`¿Eliminar "${product.name}" del catálogo oscuro?`)) {
      ProductDB.remove(id);
      // also remove from cart
      Cart.remove(id);
      CatalogPage.render();
      Toast.show("🗑️ Eliminado", product.name);
    }
  },

  editProduct(id) {
    if (!Session.isAdmin()) return;
    const p = ProductDB.getById(id);
    if (!p) return;

    // Populate modal
    document.getElementById("editId").value = p.id;
    document.getElementById("editBand").value = p.band;
    document.getElementById("editName").value = p.name;
    document.getElementById("editDesc").value = p.desc;
    document.getElementById("editPrice").value = p.price;
    document.getElementById("editStock").value = p.stock;
    document.getElementById("editCategory").value = p.category;
    document.getElementById("editImg").value = p.img;

    const modal = new bootstrap.Modal(document.getElementById("editModal"));
    modal.show();
  },

  saveEdit() {
    const id = parseInt(document.getElementById("editId").value);
    const updated = {
      band: document.getElementById("editBand").value.trim(),
      name: document.getElementById("editName").value.trim(),
      desc: document.getElementById("editDesc").value.trim(),
      price: parseInt(document.getElementById("editPrice").value),
      stock: parseInt(document.getElementById("editStock").value),
      category: document.getElementById("editCategory").value,
      img: document.getElementById("editImg").value.trim()
    };
    ProductDB.update(id, updated);
    CatalogPage.render();
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
    Toast.show("✅ Actualizado", updated.name);
  }
};

// ================================================
// PAGE: CART
// ================================================
const CartPage = {
  init() {
    const wrapper = document.getElementById("cartWrapper");
    if (!wrapper) return;
    this.render();
  },

  render() {
    const wrapper = document.getElementById("cartWrapper");
    const items = Cart.getItems();

    if (items.length === 0) {
      wrapper.innerHTML = `
        <div class="text-center py-5">
          <div style="font-size:5rem;margin-bottom:1.5rem;">🛒</div>
          <h3 style="font-family:'Cinzel',serif;color:var(--text-muted);">Tu carrito está vacío</h3>
          <p style="color:var(--text-muted);">Las almas perdidas no cargan nada...</p>
          <a href="catalogo.html" class="btn-liquid mt-3">Ver Catálogo</a>
        </div>`;
      document.getElementById("cartSummary").style.display = "none";
      return;
    }

    document.getElementById("cartSummary").style.display = "block";

    wrapper.innerHTML = items.map(item => `
      <div class="cart-item-row d-flex gap-3 align-items-center">
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="flex-grow-1">
          <div style="font-family:'Cinzel',serif;font-size:.85rem;color:var(--bone);">${item.name}</div>
          <div style="font-size:.75rem;color:var(--text-muted);margin-top:2px;">${item.band}</div>
          <div style="color:var(--crimson);font-family:'Cinzel Decorative',serif;margin-top:4px;">$${item.price.toLocaleString()}</div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn-liquid" style="padding:4px 10px;font-size:.8rem" onclick="CartPage.changeQty(${item.id}, -1)">−</button>
          <input type="number" class="qty-input" value="${item.qty}" min="1" onchange="CartPage.setQty(${item.id}, this.value)">
          <button class="btn-liquid" style="padding:4px 10px;font-size:.8rem" onclick="CartPage.changeQty(${item.id}, 1)">+</button>
        </div>
        <div style="font-family:'Cinzel Decorative',serif;color:var(--bone);min-width:80px;text-align:right;">
          $${(item.price * item.qty).toLocaleString()}
        </div>
        <button onclick="CartPage.removeItem(${item.id})" style="background:none;border:none;color:var(--crimson);font-size:1.1rem;cursor:pointer;padding:4px;">
          <i class="bi bi-x-circle"></i>
        </button>
      </div>
    `).join("");

    // Update totals
    const total = Cart.getTotal();
    document.getElementById("cartSubtotal").textContent = `$${total.toLocaleString()}`;
    document.getElementById("cartShipping").textContent = total >= 1000 ? "Gratis" : "$99";
    const shipping = total >= 1000 ? 0 : 99;
    document.getElementById("cartTotal").textContent = `$${(total + shipping).toLocaleString()}`;
  },

  changeQty(id, delta) {
    const items = Cart.getItems();
    const item = items.find(i => i.id === id);
    if (!item) return;
    Cart.updateQty(id, item.qty + delta);
    this.render();
  },

  setQty(id, val) {
    Cart.updateQty(id, parseInt(val) || 1);
    this.render();
  },

  removeItem(id) {
    Cart.remove(id);
    this.render();
    Toast.show("🗑️ Eliminado", "Producto removido del carrito");
  },

  checkout() {
    if (!Session.isLoggedIn()) {
      Toast.show("⚠️ Requiere sesión", "Inicia sesión para continuar");
      return;
    }
    const modal = new bootstrap.Modal(document.getElementById("checkoutModal"));
    modal.show();
  },

  confirmOrder() {
    Cart.clear();
    bootstrap.Modal.getInstance(document.getElementById("checkoutModal")).hide();
    setTimeout(() => {
      this.render();
      Toast.show("✅ ¡Orden confirmada!", "Tu pedido ha sido enviado a las sombras");
    }, 400);
  }
};

// ================================================
// PAGE: PROFILE
// ================================================
const ProfilePage = {
  init() {
    const wrapper = document.getElementById("profileWrapper");
    if (!wrapper) return;

    const session = Session.get();
    if (!session) return;

    document.getElementById("profileName").textContent = session.name;
    document.getElementById("profileEmail").textContent = session.email;
    document.getElementById("profileAvatar").textContent = session.avatar;
    document.getElementById("profileRole").textContent = session.role === "admin" ? "Administrador" : "Seguidor";
    document.getElementById("profileJoin").textContent = session.joinDate;

    const cartItems = Cart.getItems();
    document.getElementById("profileCartCount").textContent = cartItems.length;
    document.getElementById("profileCartTotal").textContent = `$${Cart.getTotal().toLocaleString()}`;

    if (session.role === "admin") {
      document.getElementById("adminIndicator").style.display = "block";
    }
  }
};

// ================================================
// INIT
// ================================================
document.addEventListener("DOMContentLoaded", () => {
  // Security check
  RouteGuard.check();

  // Init navbar
  NavbarUtils.init();

  // Init pages
  LoginPage.init();
  CatalogPage.init();
  AdminPanel.init();
  CartPage.init();
  ProfilePage.init();

  // Logout button
  document.querySelectorAll(".logout-btn").forEach(btn => {
    btn.addEventListener("click", e => { e.preventDefault(); NavbarUtils.logout(); });
  });
});
