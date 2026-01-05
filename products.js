// EDITAR: solo cambiar este archivo para agregar/borrar productos.
// imgs: array de rutas a imágenes (JPG, PNG, SVG, WEBP, etc.)
export const products = [
  {
    id: 1,
    name: "Osito Sonriente",
    imgs: ["img/amigurumi-1.svg"],
    desc: "Oso tierno en tonos cálidos, perfecto para abrazar. Relleno 100% algodón.",
    size: { width: 15, height: 20 },
    price: 28.50
  },
  {
    id: 2,
    name: "Gato Pastel",
    imgs: ["img/amigurumi-2.svg"],
    desc: "Gatito adorable en colores pastel. Ideal para decoración o regalo especial.",
    size: { width: 12, height: 18 },
    price: 24.00
  },
  {
    id: 3,
    name: "Conejo Rosa",
    imgs: ["img/amigurumi-3.svg"],
    desc: "Conejo con orejas largas en rosa intenso. Super kawaii y suave.",
    size: { width: 10, height: 22 },
    price: 26.00
  },
  {
    id: 4,
    name: "Lola Cutis",
    imgs: ["img/lolo.jpg"],
    desc: "Amigurumi adorable y suave con detalles únicos.",
    size: { width: 14, height: 18 },
    price: 35.00
  }
];

// Renderizar catálogo
function renderCatalog() {
  const catalog = document.getElementById('catalog');
  const storedProducts = localStorage.getItem('products');
  let itemsToRender = storedProducts ? JSON.parse(storedProducts) : products;
  
  // Migración: convertir "img" a "imgs" si existen datos viejos
  itemsToRender = itemsToRender.map(p => ({
    ...p,
    imgs: p.imgs || (p.img ? [p.img] : [])
  }));

  // Validar que existan imágenes y filtrar productos sin imágenes válidas
  itemsToRender = itemsToRender.filter(p => p.imgs && p.imgs.length > 0);
  
  // Ordenar por precio ascendente
  itemsToRender.sort((a, b) => a.price - b.price);

  catalog.innerHTML = itemsToRender.map(product => `
    <article class="card" aria-label="Producto: ${product.name}, $${product.price.toFixed(2)}">
      <img 
        src="${product.imgs[0]}" 
        alt="${product.name} - Amigurumi hecho a mano"
        class="card__img"
        loading="lazy"
        width="500"
        height="500"
      />
      <h3 class="card__name">${product.name}</h3>
      <p class="card__desc">${product.desc}</p>
      ${product.imgs.length > 1 ? `<p class="card__badge">+${product.imgs.length - 1} fotos</p>` : ''}
      <p class="card__size">
        <span class="card__label">Medidas:</span> 
        ${product.size.width} × ${product.size.height} cm
      </p>
      <p class="card__price">$${product.price.toFixed(2)}</p>
    </article>
  `).join('');

  // Lightbox: ver imagen en grande al presionar (mínimo JS, sin dependencias)
  const catalogEl = document.getElementById('catalog');
  const lightbox = document.getElementById('lightbox');
  if (catalogEl && lightbox) {
    // Delegación de eventos: abrir
    catalogEl.onclick = (e) => {
      const img = e.target.closest && e.target.closest('.card__img');
      if (!img) return;
      const card = img.closest('.card');
      const productName = card.querySelector('.card__name').textContent;
      const productIdx = itemsToRender.findIndex(p => p.name === productName);
      const product = itemsToRender[productIdx];
      if (!product) return;

      // Galería: mostrar todas las imágenes del producto
      const galleryHTML = product.imgs.length > 1 
        ? `<div class="lightbox__gallery">
             <img src="${product.imgs[0]}" alt="${productName}" class="lightbox__img" />
             <div class="lightbox__thumbs">
               ${product.imgs.map((imgSrc, idx) => `
                 <button class="lightbox__thumb ${idx === 0 ? 'active' : ''}" data-src="${imgSrc}" aria-label="Foto ${idx+1}"></button>
               `).join('')}
             </div>
           </div>`
        : `<img src="${product.imgs[0]}" alt="${productName}" class="lightbox__img" />`;

      lightbox.innerHTML = `
        <div class="lightbox__backdrop" tabindex="0">
          ${galleryHTML}
        </div>`;
      lightbox.hidden = false;
      lightbox.querySelector('.lightbox__backdrop').focus();

      // Click en miniaturas
      lightbox.querySelectorAll('.lightbox__thumb').forEach(thumb => {
        thumb.onclick = (ev) => {
          const src = ev.target.dataset.src;
          lightbox.querySelector('.lightbox__img').src = src;
          lightbox.querySelectorAll('.lightbox__thumb').forEach(t => t.classList.remove('active'));
          ev.target.classList.add('active');
        };
      });
    };

    // Cerrar con ESC o click en backdrop
    window.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') lightbox.hidden = true; });
    lightbox.onclick = (ev) => { if (ev.target.classList.contains('lightbox__backdrop')) lightbox.hidden = true; };
  }
}

window.addEventListener('load', renderCatalog);

// ------------------
// ADMIN (preview local usando localStorage)
// ------------------
function getStoredProducts() {
  const s = localStorage.getItem('products');
  return s ? JSON.parse(s) : products.slice();
}

function saveStoredProducts(arr) {
  localStorage.setItem('products', JSON.stringify(arr));
  renderCatalog();
  renderAdminList();
}

function renderAdminList() {
  const list = document.getElementById('adminList');
  if (!list) return;
  const items = getStoredProducts();
  list.innerHTML = items.map(p => `
    <li>
      <span>${p.name} — $${p.price.toFixed(2)}</span>
      <span>
        <button data-id="${p.id}" class="admin-edit">Editar</button>
        <button data-id="${p.id}" class="admin-del">Borrar</button>
      </span>
    </li>
  `).join('');

  list.querySelectorAll('.admin-edit').forEach(btn => btn.onclick = (e) => {
    const id = Number(e.target.dataset.id);
    const prod = getStoredProducts().find(x => x.id === id);
    if (!prod) return;
    populateForm(prod);
  });
  list.querySelectorAll('.admin-del').forEach(btn => btn.onclick = (e) => {
    const id = Number(e.target.dataset.id);
    const remaining = getStoredProducts().filter(x => x.id !== id);
    saveStoredProducts(remaining);
  });
}

function populateForm(p) {
  document.getElementById('prodId').value = p.id;
  document.getElementById('prodName').value = p.name || '';
  document.getElementById('prodImg').value = (p.imgs && p.imgs[0]) || p.img || '';
  document.getElementById('prodDesc').value = p.desc || '';
  document.getElementById('prodW').value = p.size?.width || '';
  document.getElementById('prodH').value = p.size?.height || '';
  document.getElementById('prodPrice').value = p.price || '';
}

function clearForm() {
  ['prodId','prodName','prodImg','prodDesc','prodW','prodH','prodPrice'].forEach(id => document.getElementById(id).value = '');
}

function initAdmin() {
  const toggle = document.getElementById('adminToggle');
  const panel = document.getElementById('adminPanel');
  const close = document.getElementById('adminClose');
  const save = document.getElementById('adminSave');
  const add = document.getElementById('adminAdd');
  const reset = document.getElementById('adminReset');

  if (!toggle || !panel) return;
  toggle.onclick = () => { panel.hidden = !panel.hidden; panel.setAttribute('aria-hidden', String(panel.hidden)); toggle.setAttribute('aria-expanded', String(!panel.hidden)); renderAdminList(); };
  close.onclick = () => { panel.hidden = true; panel.setAttribute('aria-hidden','true'); toggle.setAttribute('aria-expanded','false'); };
  add.onclick = () => { clearForm(); document.getElementById('prodName').focus(); };
  reset.onclick = () => { localStorage.removeItem('products'); renderCatalog(); renderAdminList(); clearForm(); };

  save.onclick = () => {
    const idVal = document.getElementById('prodId').value;
    const name = document.getElementById('prodName').value.trim();
    const img = document.getElementById('prodImg').value.trim();
    const desc = document.getElementById('prodDesc').value.trim();
    const w = Number(document.getElementById('prodW').value) || 0;
    const h = Number(document.getElementById('prodH').value) || 0;
    const price = Number(document.getElementById('prodPrice').value) || 0;
    if (!name || !img) { alert('Nombre e imagen son obligatorios'); return; }

    const arr = getStoredProducts();
    if (idVal) {
      const id = Number(idVal);
      const idx = arr.findIndex(x => x.id === id);
      if (idx >= 0) {
        arr[idx] = { id, name, imgs: [img], desc, size: { width: w, height: h }, price };
      }
    } else {
      const newId = (arr.reduce((m,x)=> Math.max(m,x.id), 0) || 0) + 1;
      arr.push({ id: newId, name, imgs: [img], desc, size: { width: w, height: h }, price });
    }
    saveStoredProducts(arr);
    clearForm();
  };

  // Inicializar lista
  renderAdminList();
}

window.addEventListener('load', () => { initAdmin(); });
