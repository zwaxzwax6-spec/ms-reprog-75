// === MS REPROG 75 — Panier (sessionStorage) ===
// Compatible avec Stripe Checkout via Vercel Serverless Function

// Catalogue central des produits (source unique de vérité)
const CART_PRODUCTS = {
  // === ATELIER (9 prestations) ===
  'stage1-atelier':       { id: 'stage1-atelier',       name: 'Stage 1',                            category: 'Atelier · Reprogrammation', price: 300, type: 'atelier' },
  'stage2-atelier':       { id: 'stage2-atelier',       name: 'Stage 2',                            category: 'Atelier · Reprogrammation', price: 300, type: 'atelier' },
  'e85-atelier':          { id: 'e85-atelier',          name: 'Reprogrammation E85',                category: 'Atelier · Flex Fuel',       price: 300, type: 'atelier' },
  'depollution-atelier':  { id: 'depollution-atelier',  name: 'Suppression FAP / EGR / Lambda',     category: 'Atelier · Dépollution',     price: 149, type: 'atelier' },
  'adblue-nox-atelier':   { id: 'adblue-nox-atelier',   name: 'AdBlue + NOX',                       category: 'Atelier · Dépollution',     price: 249, type: 'atelier' },
  'adblue-fap-atelier':   { id: 'adblue-fap-atelier',   name: 'AdBlue + FAP / EGR / Lambda',        category: 'Atelier · Dépollution',     price: 299, type: 'atelier' },
  'immo-off-atelier':     { id: 'immo-off-atelier',     name: 'IMMO OFF',                           category: 'Atelier · Électronique',    price: 169, type: 'atelier' },
  'reparation-frm':       { id: 'reparation-frm',       name: 'Réparation FRM',                     category: 'Atelier · Électronique',    price: 149, type: 'atelier' },
  'clonage-calculateur':  { id: 'clonage-calculateur',  name: 'Clonage de calculateur',             category: 'Atelier · Électronique',    price: 199, type: 'atelier' },

  // === FICHIERS À DISTANCE (5 fichiers) ===
  'egr-off-fichier':      { id: 'egr-off-fichier',      name: 'EGR OFF',                            category: 'Fichier · Distance',        price: 30,  type: 'fichier' },
  'fap-off-fichier':      { id: 'fap-off-fichier',      name: 'FAP OFF',                            category: 'Fichier · Distance',        price: 40,  type: 'fichier' },
  'immo-off-fichier':     { id: 'immo-off-fichier',     name: 'IMMO OFF',                           category: 'Fichier · Distance',        price: 50,  type: 'fichier' },
  'adblue-off-fichier':   { id: 'adblue-off-fichier',   name: 'AdBlue OFF',                         category: 'Fichier · Distance',        price: 50,  type: 'fichier' },
  'stage1-fichier':       { id: 'stage1-fichier',       name: 'Stage 1 (fichier)',                  category: 'Fichier · Distance',        price: 70,  type: 'fichier' },
};

// === API Cart ===
const Cart = {
  STORAGE_KEY: 'msreprog_cart',

  load() {
    try {
      return JSON.parse(sessionStorage.getItem(this.STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  },

  save(items) {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.render();
  },

  add(productId) {
    const product = CART_PRODUCTS[productId];
    if (!product) return console.error('Produit inconnu:', productId);
    const items = this.load();
    const existing = items.find(i => i.id === productId);
    if (existing) {
      existing.quantity++;
    } else {
      items.push({ ...product, quantity: 1 });
    }
    this.save(items);
    showToast(`${product.name} ajouté au panier`);
  },

  remove(productId) {
    const items = this.load().filter(i => i.id !== productId);
    this.save(items);
  },

  updateQty(productId, delta) {
    const items = this.load();
    const item = items.find(i => i.id === productId);
    if (!item) return;
    item.quantity = Math.max(1, item.quantity + delta);
    this.save(items);
  },

  clear() {
    this.save([]);
  },

  count() {
    return this.load().reduce((sum, item) => sum + item.quantity, 0);
  },

  total() {
    return this.load().reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  // Render UI elements (count badge, drawer, cart page)
  render() {
    const count = this.count();

    // Update floating cart button count (desktop)
    document.querySelectorAll('.cart-button-count').forEach(el => {
      el.textContent = count;
      el.classList.toggle('empty', count === 0);
    });

    // Update mobile cart icon in navbar
    document.querySelectorAll('.nav-cart-mobile-count').forEach(el => {
      el.textContent = count;
    });
    document.querySelectorAll('.nav-cart-mobile').forEach(el => {
      el.classList.toggle('has-items', count > 0);
    });

    // Hide floating cart button if empty
    document.querySelectorAll('.cart-button').forEach(el => {
      el.style.display = (count === 0) ? 'none' : 'inline-flex';
    });

    // Render drawer
    this.renderDrawer();

    // Update "added" state on buttons
    const items = this.load();
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      const id = btn.dataset.productId;
      const inCart = items.find(i => i.id === id);
      btn.classList.toggle('added', !!inCart);
      const span = btn.querySelector('.add-label');
      if (span) span.textContent = inCart ? 'Ajouté' : 'Ajouter';
    });
  },

  renderDrawer() {
    const body = document.querySelector('.cart-drawer-body');
    const footer = document.querySelector('.cart-drawer-footer');
    if (!body) return;

    const items = this.load();

    if (items.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <svg class="cart-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <p>Votre panier est vide.</p>
        </div>
      `;
      if (footer) footer.style.display = 'none';
      return;
    }

    body.innerHTML = items.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-cat">${item.category}</div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="Cart.updateQty('${item.id}', -1)" aria-label="Diminuer">−</button>
            <span class="qty-display">${item.quantity}</span>
            <button class="qty-btn" onclick="Cart.updateQty('${item.id}', 1)" aria-label="Augmenter">+</button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
          <span class="cart-item-price">${(item.price * item.quantity).toFixed(0)} €</span>
          <button class="cart-item-remove" onclick="Cart.remove('${item.id}')">Retirer</button>
        </div>
      </div>
    `).join('');

    if (footer) {
      footer.style.display = 'block';
      const totalEl = footer.querySelector('.cart-total-amount');
      if (totalEl) totalEl.textContent = this.total().toFixed(0) + ' €';
    }
  },
};

// === Drawer toggle ===
function openCartDrawer() {
  document.querySelector('.cart-drawer-overlay')?.classList.add('open');
  document.querySelector('.cart-drawer')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCartDrawer() {
  document.querySelector('.cart-drawer-overlay')?.classList.remove('open');
  document.querySelector('.cart-drawer')?.classList.remove('open');
  document.body.style.overflow = '';
}

// === Toast ===
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span class="toast-msg"></span>
    `;
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast-msg').textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 2400);
}

// === Stripe Checkout ===
async function checkout() {
  const items = Cart.load();
  if (items.length === 0) return;

  const btn = event?.target;
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>Redirection vers le paiement…</span>';
  }

  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map(i => ({
          id: i.id,
          name: i.name,
          description: i.category,
          price: i.price,
          quantity: i.quantity,
        })),
      }),
    });

    if (!response.ok) throw new Error('Erreur de création de la session de paiement');
    const data = await response.json();
    if (!data.url) throw new Error('URL Stripe manquante');

    // Redirect to Stripe Checkout
    window.location.href = data.url;
  } catch (err) {
    console.error('Checkout error:', err);
    showToast('Erreur — réessayez ou contactez-nous');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `Procéder au paiement <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
    }
  }
}

// === Init on page load ===
document.addEventListener('DOMContentLoaded', () => {
  Cart.render();

  // Close drawer on overlay click
  document.querySelector('.cart-drawer-overlay')?.addEventListener('click', closeCartDrawer);

  // Close drawer on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCartDrawer();
  });

  // Bind add-to-cart buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.productId;
      if (id) Cart.add(id);
    });
  });
});

