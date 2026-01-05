// EDITAR: solo cambiar este archivo para agregar/borrar productos.
// Estructura: id, name, imgs (array de rutas), desc, size, price
export const products = [
  {
    "id": 1,
    "name": "pica",
    "imgs": [
      "img/lolo.jpg"
    ],
    "desc": "gay",
    "size": {
      "width": 34,
      "height": 89
    },
    "price": 24
  }
];

function renderCatalog() {
  const catalog = document.getElementById('catalog');
  
  // Prioridad: datos admin en localStorage > datos del repo
  let itemsToRender = window.productsData || products;
  if (!itemsToRender || itemsToRender.length === 0) {
    itemsToRender = products;
  }
  
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

window.renderCatalog = renderCatalog;

window.addEventListener('load', renderCatalog);
